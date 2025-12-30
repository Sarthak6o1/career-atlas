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
        cache_key = self._get_cache_key("jobs_general_v2", target_role, location)
        
        # Check Redis Cache
        if self.redis_client:
            cached_result = self.redis_client.get(cache_key)
            if cached_result:
                self.logger.info(f"Serving cached job search for {target_role} from Redis")
                return cached_result

        # General Search Strategy (Actionable Links)
        location_str = f"in {location}" if location else ""
        query_role = f'"{target_role}"'
        
        # Broad queries including aggregators
        search_queries = [
            f'{query_role} jobs {location_str} "apply"',
            f'{query_role} careers {location_str}',
            f'{query_role} vacancies {location_str}'
        ]

        results = []
        with DDGS() as ddgs:
            # Phase 1: Fresh Jobs (Past Week)
            for query in search_queries:
                try:
                    # Use "wt-wt" (Global) instead of "us-en" so queries like "India" work
                    gen = ddgs.text(query, max_results=5, region="wt-wt", timelimit='w')
                    for r in gen:
                        if not any(x['href'] == r['href'] for x in results):
                            results.append(r)
                except Exception: continue
            
            # Phase 2: Broader Search (Past Month) if fewer than 5 results
            if len(results) < 5:
                for query in search_queries:
                    try:
                        gen = ddgs.text(query, max_results=3, region="wt-wt", timelimit='m')
                        for r in gen:
                            if not any(x['href'] == r['href'] for x in results):
                                results.append(r)
                    except Exception: continue

        if not results:
            return f"### 📉 Search returned no matches\nCould not find jobs for **{target_role}** {location_str}.\n\n**Suggestions**:\n* Try broader keywords.\n* Remove location constraints."

        if not results:
            return f"### 📉 Search returned no matches\nCould not find jobs for **{target_role}** {location_str}.\n\n**Suggestions**:\n* Try broader keywords.\n* Remove location constraints."

        # Prepare data for LLM translation/formatting
        raw_listings = ""
        unique_links = set()
        
        for job in results:
            if len(unique_links) >= 15: break
            if job['href'] in unique_links: continue
            unique_links.add(job['href'])
            
            raw_listings += f"Title: {job['title']}\nLink: {job['href']}\nSnippet: {job['body']}\n---\n"

        # Use LLM to Translate & Format
        prompt = f"""
        You are a Global Career Assistant.
        The user wants job opportunities for "{target_role}" {location_str}.
        
        Raw Search Results (may be in various languages):
        {raw_listings}
        
        INSTRUCTIONS:
        1. Review the raw results.
        2. TRANSLATE any non-English content (Titles/Snippets) into English.
        3. Filter out irrelevant or broken results.
        4. Format the output as a Markdown list.
        5. For each valid job, output:
           #### [English Title](Link)
           > English Snippet...
           [👉 Apply Now](Link)
           
        6. Start with a header: "### 🌍 Opportunity Radar: {target_role} (Global)"
        """
        
        formatted_jobs = _generate(prompt)
        
        # Use Redis Cache
        if self.redis_client:
            self.redis_client.setex(cache_key, 21600, formatted_jobs) # 6 hours cache
            
        return formatted_jobs

    def find_interview_intel(self, target_role: str, target_company: str, vector_matches: list | None = None) -> str:
        cache_key = self._get_cache_key("interview", target_role, target_company)
        
        # Check Redis Cache
        if self.redis_client:
            cached_result = self.redis_client.get(cache_key)
            if cached_result:
                self.logger.info(f"Serving cached interview intel for {target_company} from Redis")
                return cached_result

        # Disambiguate short acronyms
        query_role_enhanced = target_role
        if len(target_role) < 5 and "sde" in target_role.lower():
            query_role_enhanced = f"{target_role} software engineer"
        
        query_intel_raw = f'"{query_role_enhanced}" "{target_company}" interview questions'
        query_company = f'"{target_company}" engineering culture values'

        results = []
        video_results = []
        
        try:
            with DDGS() as ddgs:
                # Text Search (Global to allow local intel)
                for r in ddgs.text(query_intel_raw, max_results=4, region="wt-wt", safesearch='active'):
                    r['type'] = 'Question Bank'
                    results.append(r)
                for r in ddgs.text(query_company, max_results=3, region="wt-wt", safesearch='active'):
                    r['type'] = 'Culture'
                    results.append(r)
                
                # Video Search (YouTube via DDGS)
                # User requested "youtube api" style results. DDGS videos proxys this effectively.
                video_query = f"{query_role_enhanced} {target_company} interview prep"
                for v in ddgs.videos(video_query, max_results=3, region="wt-wt", license=None, duration=None):
                    video_results.append({
                        'title': v['title'],
                        'link': v['content'], # DDGS returns 'content' as url usually
                        'duration': v.get('duration', 'N/A')
                    })

                # Course Search (Broad: Udemy, Coursera, GFG, Educative, edX)
                course_search_domains = "site:udemy.com OR site:coursera.org OR site:geeksforgeeks.org OR site:educative.io OR site:edx.org OR site:leetcode.com"
                course_query = f'{course_search_domains} "{query_role_enhanced}" interview prep'
                for r in ddgs.text(course_query, max_results=4, region="wt-wt", safesearch='active'):
                    r['type'] = 'Course/Practice'
                    results.append(r)

        except Exception as e:
            self.logger.error(f"Search failed: {e}")
            return self._generate_fallback_report(target_role, target_company)
            
        if not results and not video_results:
             return self._generate_fallback_report(target_role, target_company)

        scraped_content = ""
        resources = []
        courses = []
        
        for i, res in enumerate(results):
            if 'Course' in res['type']:
                courses.append(f"- [{res['title']}]({res['href']})")
                continue
                
            resources.append(f"- [{res['title']}]({res['href']}) ({res['type']})")
            try:
                page_response = requests.get(res['href'], timeout=4, headers={"User-Agent": "Mozilla/5.0"})
                if page_response.status_code == 200:
                    soup = BeautifulSoup(page_response.text, 'html.parser')
                    for script in soup(["script", "style"]): script.decompose()
                    text = soup.get_text()[:4000] 
                    scraped_content += f"\n--- Source ({res['type']}): {res['title']} ---\n{text}\n"
            except: continue
        
        # Add Videos to Context (Titles only)
        video_titles = [v['title'] for v in video_results]
        course_titles = [c.split(']')[0][2:] for c in courses] # Extract titles from markdown link
        
        scraped_content += f"\n--- Relevant Videos Found ---\n" + "\n".join(video_titles)
        scraped_content += f"\n--- Relevant Courses Found ---\n" + "\n".join(course_titles)

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
        
        Produce a "Strategic Intelligence Briefing" (Markdown).
        Structure:
        ### 🏢 Culture & Values Decoder
        * What does this company actually value?
        * "Why us?" answer strategy.

        ### 🔧 Technical Deep Dive
        * Specific tech stack components mentioned in the search.
        * System design themes (scalability, microservices, etc.) relevant to them.

        ### ❓ Predicted Question Bank
        * 3 Technical Analysis questions suitable for this role/company.
        * 3 Behavioral questions based on their values.

        ### 📺 Recommended Watching (YouTube)
        * Summarize key takeaways from the videos.
        
        ### 🎓 Recommended Courses & Practice
        * Highlight the most relevant courses or practice sets found.
        """
        
        report = _generate(prompt)
        
        # Append Video Links to Report
        if video_results:
            report += "\n\n### 🎥 Watch List\n"
            for v in video_results:
                report += f"- [{v['title']}]({v['link']}) ({v['duration']})\n"

        # Append Course Links
        if courses:
             report += "\n\n### 🎓 Learning Paths\n"
             report += "\n".join(courses)

        report += "\n\n### 🔗 Intel Sources\n"
        report += "\n".join(resources[:8]) 
        
        # Use Redis Cache (Expire in 24 hours)
        if self.redis_client:
            self.redis_client.setex(cache_key, 86400, report)
            
        return report

    def _generate_fallback_report(self, target_role: str, target_company: str) -> str:
        prompt = f"""
        You are an elite Technical Interview Coach.
        The system could not retrieve live web data for {target_company}, so provide a HIGH-LEVEL GENERAL STRATEGY.
        Role: {target_role}
        Company: {target_company}
        
        Produce a "Strategic Intelligence Briefing (General Strategy)" (Markdown).
        Structure:
        ### 🏢 Common Tech Company Cultural Values
        * What do top-tier companies usually look for? (Bias for Action, Ownership, etc.)
        
        ### 🔧 Standard Technical Expectations ({target_role})
        * Key technologies usually required for this role.
        * Fundamental system design concepts.

        ### ❓ Standard Interview Questions
        * 3 Universal Technical Questions for {target_role}.
        * 3 Standard Behavioral Questions (STAR method).

        ### 📚 Recommended Universal Resources
        * List 3 standard must-read books/sites (e.g. Cracking the Coding Interview, System Design Primer).
        """
        return _generate(prompt)

from functools import lru_cache
@lru_cache()
def get_deep_research_agent():
    return DeepResearchAgent()
