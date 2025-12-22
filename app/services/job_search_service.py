from duckduckgo_search import DDGS
from app.generation.llm import _generate
import json
import requests
from bs4 import BeautifulSoup

class JobSearchService:
    def find_jobs(self, resume_text: str, target_role: str, vector_matches: list | None = None, location: str | None = None, job_type: str | None = None, experience_level: str | None = None) -> str:
        # 1. Agentic Step: Analyze Resume AND Vector Matches to build the perfect search query
        
        # Prepare context string from vector matches if available
        match_context = ""
        if vector_matches:
            snippets = [m['snippet'][:200] for m in vector_matches if 'snippet' in m]
            match_context = "\nSimilar Jobs/Skills from Database:\n" + "\n".join(snippets)

        # SIMPLIFIED STRATEGY: Directly construct query if possible, or use LLM for refinement only
        location_str = f" in {location}" if location else " remote"
        job_type_str = f" {job_type}" if job_type else ""
        exp_str = f" {experience_level}" if experience_level else ""
        
        prompt = f"""
        You are an expert Job Scraper.
        Create a SIMPLE, GENERIC search query string to find job postings.
        
        Target Role: "{target_role}"
        Location Preference: "{location if location else 'Remote/Any'}"
        Job Type: "{job_type if job_type else 'Any'}"
        Experience Level: "{experience_level if experience_level else 'Any'}"
        
        Resume/Skills Context:
        {match_context}
        
        Your Goal: Create a search query like: "[Role] jobs [Location] [Job Type] [Experience] hiring now"
        Do not make it too complex. 
        
        Return ONLY the raw search query string.
        """
        
        search_query = _generate(prompt).strip().replace('"', '')
        
        # 2. Execute Search (LIVE Web - Past Month)
        results = []
        try:
            with DDGS() as ddgs:
                # timelimit='m' ensures we only get jobs posted in the Last Month
                ddgs_gen = ddgs.text(f"{search_query}", max_results=10, timelimit='m') 
                for r in ddgs_gen:
                    results.append(r)
        except Exception as e:
            return f"Error executing search: {str(e)}"
            
        if not results:
            return f"No recent job listings found for **{search_query}**. Try broadening your search or removing strict filters."
            
        # 3. Agentic Verification (Live Site Analysis)
        formatted_jobs = f"### 🌍 Agentic Job Search Report (Live Web)\n"
        formatted_jobs += f"**Strategy**: Searched for *{search_query}* (Past Month)\n"
        formatted_jobs += "I have scanned the live web. Here are the most relevant opportunities:\n\n"
        
        # INCREASED VERIFICATION: Verify top 5 results
        for i, job in enumerate(results):
            title = job['title']
            link = job['href']
            snippet = job['body']
            
            if i < 5: # Deep analysis for top 5
                verified_note = ""
                try:
                    # Attempt to fetch page content (Agentic "Visiting")
                    page_response = requests.get(link, timeout=8, headers={"User-Agent": "Mozilla/5.0"})
                    
                    if page_response.status_code == 200:
                        soup = BeautifulSoup(page_response.text, 'html.parser')
                        # Extract text, removing scripts/styles
                        for script in soup(["script", "style"]):
                            script.decompose()
                        text_content = soup.get_text()[:4500] 
                        
                        # Quick LLM verification
                        match_prompt = f"""
                        I am an AI agent applying for jobs for my user.
                        
                        User Resume Summary: {resume_text[:1000]}...
                        
                        Target Job Page Content (LIVE SCRAPED DATA):
                        {text_content}...
                        
                        Is this job actually a good fit based on the content?
                        Answer in 1 sentence starting with "✅ Strong Match:" or "⚠️ Potential Mismatch:".
                        """
                        verified_note = "\n> " + _generate(match_prompt).strip()
                    else:
                        verified_note = f"\n> *⚠️ Link Unreachable (Status {page_response.status_code})*"
                except:
                    verified_note = "\n> *Could not verify page content automatically (Timeout/Blocks).*"
                
                formatted_jobs += f"#### [{title}]({link})\n"
                formatted_jobs += f"{snippet}\n"
                formatted_jobs += f"**Agent Verification**: {verified_note}\n\n"
                
            else:
                formatted_jobs += f"- **[{title}]({link})**\n"
                
        formatted_jobs += "\n*Note: Top results were visited and verified live.*"
        
        return formatted_jobs

    def find_interview_intel(self, target_role: str, target_company: str, vector_matches: list | None = None) -> str:
        # 1. Search 1: Questions & Intel (Past Year)
        query_intel = f"recent interview questions for {target_role} at {target_company} 2024 2025"
        
        # 2. Search 2: Core Concepts (General)
        query_concepts = f"core technical concepts for {target_role} interview"

        # 3. Search 3: Videos (Past Year)
        query_video = f"best youtube interview prep {target_role} 2024 2025"

        results = []
        try:
            with DDGS() as ddgs:
                # Fetch intel - Past Year
                for r in ddgs.text(query_intel, max_results=4, timelimit='y'):
                    r['type'] = 'intel'
                    results.append(r)
                
                # Fetch concepts - No time limit (concepts are timeless)
                for r in ddgs.text(query_concepts, max_results=3):
                    r['type'] = 'concept'
                    results.append(r)
                    
                # Fetch videos - Past Year
                for r in ddgs.text(query_video, max_results=3, timelimit='y'):
                    r['type'] = 'video'
                    results.append(r)
                    
        except Exception as e:
            return f"Error executing research: {str(e)}"
            
        if not results:
            return f"No specific intel found for **{target_role}** at **{target_company}**."

        # 3. Scrape & Synthesize
        scraped_content = ""
        # Store links to inject into report later
        resources = []
        
        for i, res in enumerate(results):
            # Save resource for listing
            resources.append(f"- [{res['title']}]({res['href']}) ({res['type']})")
            
            try:
                page_response = requests.get(res['href'], timeout=4, headers={"User-Agent": "Mozilla/5.0"})
                if page_response.status_code == 200:
                    soup = BeautifulSoup(page_response.text, 'html.parser')
                    for script in soup(["script", "style"]):
                        script.decompose()
                    text = soup.get_text()[:4000] # Limit per page (Increased from 2500)
                    scraped_content += f"\n--- Source ({res['type']}): {res['title']} ---\n{text}\n"
            except:
                continue
        
        # Prepare context string from vector matches if available
        match_context = ""
        if vector_matches:
            snippets = [m['snippet'][:300] for m in vector_matches if 'snippet' in m]
            match_context = "\nMy Skill Level for Context (Use this to tailor difficulty, but rely on Web Data for facts):\n" + "\n".join(snippets)
            
        # 4. LLM Synthesis
        prompt = f"""
        You are an elite Technical Interview Coach.
        
        INSTRUCTIONS:
        1. Base your report PRIMARILY on the 'Raw Web Data' below. This is the fresh intelligence.
        2. Use the 'User Context' only to understand their current level (e.g. Junior vs Senior).
        3. Do NOT hallucinate questions that are not in the data.
        
        Role: {target_role}
        Company: {target_company}
        
        {match_context}
        
        Raw Web Data (Primary Source):
        {scraped_content[:25000]}
        
        Produce a "Comprehensive Agentic Prep Report" (Markdown).
        Crucially, recommend specific "Core Concepts" and "Focus Areas" based on the role.
        
        Structure:
        
        ### 🎯 Core Concepts & Focus Areas
        *   Analyze the scraping to list limits specific technical concepts (e.g. "System Design", "React Hooks", "Memory Management") that are critical for this specific role at this company.
        *   Provide a mini-roadmap for these concepts.
        
        ### ❓ Question Bank (Company Specific)
        *   List 3-5 real questions/patterns found in the intel.
        
        ### 📺 Recommended Watching & Courses
        *   Based on my search for videos/courses, explicitly recommend the best resources found.
        *   Mention the platform (YouTube, Coursera, etc) if visible in the data.
        
        ### 🔗 Referenced Resources
        *   (I will append the direct links below, you just reference them or summarize them).
        """
        
        report = _generate(prompt)
        
        # Append the actual links we found so the user can click them
        report += "\n\n### 🔗 Direct Links to Resources Found\n"
        report += "\n".join(resources[:8]) # List top 8 unique links
        
        return report

def get_job_search_service():
    return JobSearchService()
