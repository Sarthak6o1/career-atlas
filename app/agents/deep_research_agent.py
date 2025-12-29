from duckduckgo_search import DDGS
from app.generation.llm import _generate
import json
import requests
from bs4 import BeautifulSoup
from starlette.concurrency import run_in_threadpool
import logging
import redis
from app.core.config import settings

class DeepResearchAgent:
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        # Initialize Redis connection
        try:
            self.redis_client = redis.from_url(settings.REDIS_URL, decode_responses=True)
            self.redis_client.ping() # Check connection
            self.logger.info("Connected to Redis successfully.")
        except Exception as e:
            self.logger.warning(f"Redis connection failed: {e}. Falling back to no-cache mode.")
            self.redis_client = None

    async def find_jobs_async(self, resume_text: str, target_role: str, location: str | None = None, job_type: str | None = None, experience_level: str | None = None) -> str:
        return await run_in_threadpool(
            self.find_jobs, 
            resume_text, 
            target_role, 
            None, 
            location, 
            job_type, 
            experience_level
        )

    async def find_interview_intel_async(self, target_role: str, target_company: str) -> str:
        return await run_in_threadpool(
            self.find_interview_intel,
            target_role,
            target_company,
            None 
        )

    def _get_cache_key(self, prefix: str, *args):
        safe_args = [str(a)[:200] if isinstance(a, str) else str(a) for a in args]
        # Redis keys are just strings
        return f"career_atlas:{prefix}:{hash(tuple(safe_args))}"

    def find_jobs(self, resume_text: str, target_role: str, vector_matches: list | None = None, location: str | None = None, job_type: str | None = None, experience_level: str | None = None) -> str:
        cache_key = self._get_cache_key("jobs", resume_text, target_role, location, job_type, experience_level)
        
        # Check Redis Cache
        if self.redis_client:
            cached_result = self.redis_client.get(cache_key)
            if cached_result:
                self.logger.info(f"Serving cached job search for {target_role} from Redis")
                return cached_result

        # Normal Search Logic
        ats_domains = ["greenhouse.io", "lever.co", "ashbyhq.com", "workday.com", "smartrecruiters.com"]
        location_str = f"{location}" if location else "Remote"
        search_queries = []
        
        for domain in ats_domains[:3]: 
            search_queries.append(f'site:{domain} "{target_role}" {location_str}')
        search_queries.append(f'"{target_role}" {location_str} jobs "apply now" -indeed -linkedin -glassdoor')

        results = []
        with DDGS() as ddgs:
            for query in search_queries:
                try:
                    gen = ddgs.text(query, max_results=4, region="us-en", timelimit='w') 
                    for r in gen:
                        if not any(x['href'] == r['href'] for x in results):
                            results.append(r)
                except Exception:
                    continue

        if not results:
            return f"No high-quality direct links found for **{target_role}**. Try broadening your location or role keywords."

        formatted_jobs = f"### 🌍 Verified Direct-Apply Opportunities\n"
        formatted_jobs += f"**Strategy**: Targeted Top ATS Systems (Greenhouse, Lever, etc.) for *{target_role}*\n\n"
        
        valid_count = 0
        for job in results:
            if valid_count >= 8: break
            link = job['href']
            title = job['title']
            if any(x in link for x in ["linkedin.com/jobs", "indeed.com", "glassdoor.com", "ziprecruiter.com"]): continue

            try:
                resp = requests.head(link, timeout=3)
                if resp.status_code >= 400: continue
                page = requests.get(link, timeout=5, headers={"User-Agent": "Mozilla/5.0"})
                soup = BeautifulSoup(page.text, 'html.parser')
                text = soup.get_text().lower()[:2000]
                indicators = ["apply", "resume", "cv", "submit", "application"]
                if not any(x in text for x in indicators): continue 
                
                formatted_jobs += f"#### 🚀 [{title}]({link})\n"
                formatted_jobs += f"{job['body'][:150]}...\n\n"
                valid_count += 1
            except:
                continue

        if valid_count == 0:
            formatted_jobs += "Found potential matches but they didn't pass quality verification (dead links or expired)."
        
        # Use Redis Cache (Expire in 24 hours = 86400 seconds)
        if self.redis_client:
            self.redis_client.setex(cache_key, 86400, formatted_jobs)
            
        return formatted_jobs

    def find_interview_intel(self, target_role: str, target_company: str, vector_matches: list | None = None) -> str:
        cache_key = self._get_cache_key("interview", target_role, target_company)
        
        # Check Redis Cache
        if self.redis_client:
            cached_result = self.redis_client.get(cache_key)
            if cached_result:
                self.logger.info(f"Serving cached interview intel for {target_company} from Redis")
                return cached_result

        query_intel_raw = f'"{target_role}" "{target_company}" interview questions 2024 2025'
        query_concepts = f'site:medium.com OR site:dev.to OR site:github.com "{target_role}" interview guide'
        company_blog_query = f'"{target_company}" engineering blog technology stack'

        results = []
        try:
            with DDGS() as ddgs:
                for r in ddgs.text(query_intel_raw, max_results=5, timelimit='y', region="us-en"):
                    r['type'] = 'Question Bank'
                    results.append(r)
                for r in ddgs.text(company_blog_query, max_results=3, region="us-en"):
                    r['type'] = 'Company Culture'
                    results.append(r)
                for r in ddgs.text(query_concepts, max_results=3, timelimit='y', region="us-en"):
                    r['type'] = 'Guide'
                    results.append(r)
        except Exception as e:
            self.logger.error(f"Search failed: {e}")
            return f"Error executing research: {str(e)}"
            
        if not results:
            return f"No specific intel found for **{target_role}** at **{target_company}**."

        scraped_content = ""
        resources = []
        for i, res in enumerate(results):
            resources.append(f"- [{res['title']}]({res['href']}) ({res['type']})")
            try:
                page_response = requests.get(res['href'], timeout=4, headers={"User-Agent": "Mozilla/5.0"})
                if page_response.status_code == 200:
                    soup = BeautifulSoup(page_response.text, 'html.parser')
                    for script in soup(["script", "style"]): script.decompose()
                    text = soup.get_text()[:4000] 
                    scraped_content += f"\n--- Source ({res['type']}): {res['title']} ---\n{text}\n"
            except: continue
        
        match_context = ""
        if vector_matches:
            snippets = [m['snippet'][:300] for m in vector_matches if 'snippet' in m]
            match_context = "\nMy Skill Level for Context:\n" + "\n".join(snippets)
            
        prompt = f"""
        You are an elite Technical Interview Coach.
        INSTRUCTIONS:
        1. Base report on 'Raw Web Data'.
        2. Use 'User Context' for level.
        Role: {target_role}
        Company: {target_company}
        {match_context}
        Raw Web Data (Primary Source):
        {scraped_content[:25000]}
        
        Produce a "Comprehensive Agentic Prep Report" (Markdown).
        Structure:
        ### 🎯 Core Concepts & Focus Areas
        * Detailed technical concepts required.
        ### ❓ Question Bank (Company Specific)
        * 3-5 real questions found.
        ### 📺 Recommended Watching & Courses
        * Best resources specifically found in search.
        ### 🔗 Referenced Resources
        * (Append direct links below).
        """
        
        report = _generate(prompt)
        report += "\n\n### 🔗 Direct Links to Resources Found\n"
        report += "\n".join(resources[:8]) 
        
        # Use Redis Cache (Expire in 24 hours)
        if self.redis_client:
            self.redis_client.setex(cache_key, 86400, report)
            
        return report

from functools import lru_cache
@lru_cache()
def get_deep_research_agent():
    return DeepResearchAgent()
