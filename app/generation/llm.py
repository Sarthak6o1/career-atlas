import requests
import google.generativeai as genai
from app.core.config import settings
import json
MODEL_NAME = "google/gemini-flash-1.5"

# @sync_cache(ttl_seconds=86400) - Start caching again later
def _generate(prompt: str) -> str:
    last_error = ""

    if settings.OPENROUTER_API_KEY:
        try:
            url = "https://openrouter.ai/api/v1/chat/completions"
            headers = {
                "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
                "HTTP-Referer": "https://smartresume.ai",
                "X-Title": "Career Atlas",
                "Content-Type": "application/json"
            }
            data = {
                "model": MODEL_NAME,
                "messages": [{"role": "user", "content": prompt}]
            }
            response = requests.post(url, headers=headers, json=data, timeout=30)

            if response.status_code == 200:
                return response.json()['choices'][0]['message']['content']
            else:
                last_error = f"OpenRouter Error: {response.status_code} - {response.text}"
        except Exception as e:
            last_error = f"OpenRouter Exception: {str(e)}"

    if settings.GEMINI_API_KEY:
        try:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            model = genai.GenerativeModel('gemini-2.5-flash')
            response = model.generate_content(prompt)
            return response.text
        except Exception as e:
            if last_error:
                last_error += f" | Gemini Error: {str(e)}"
            else:
                last_error = f"Gemini Error: {str(e)}"

    if not settings.OPENROUTER_API_KEY and not settings.GEMINI_API_KEY:
        return "Error: No API Key configured. Please set OPENROUTER_API_KEY or GEMINI_API_KEY in .env"

    return f"⚠️ Service Unavailable: Unable to generate content. Details: {last_error}"

def get_job_fit_analysis(resume_text: str, vector_matches: list) -> str:
    potential_roles = set()
    for match in vector_matches:
        if match.get('metadata') and match['metadata'].get('category'):
            potential_roles.add(match['metadata']['category'])
            
    roles_str = ", ".join(potential_roles)
    
    prompt = f"""
    You are an expert Talent Auditor.
    
    Here is a candidate's resume (text):
    "{resume_text[:4000]}..." 
    
    Market Context (Database Matches): {roles_str}.
    
    Please provide a concise analysis in markdown format focusing on **CURRENT CAPABILITIES**:
    1. **Capability Assessment**: What can this candidate actually DO right now? (Focus on verified skills and applied knowledge from the resume).
    2. **Best Fit Role**: Which of the suggested roles ({roles_str}) aligns best with their *current* capabilities?
    3. **Immediate Value**: What specific problem can they solve for a company on Day 1?
    
    Keep it professional, direct, and focused on current capacity.
    """
    return _generate(prompt)

def generate_resume_summary(text: str, similar_profiles: list) -> str:
    prompt = f"""
    You are a biographer for professional careers.
    
    Please read the resume below and write a summary focusing STRICTLY on **PAST ACHIEVEMENTS** ("What they have done till now").
    
    Resume Text:
    "{text[:4000]}"
    
    Output structured Markdown:
    1. **Career Narrative**: A 3-sentence story of their career progression up to this point.
    2. **Track Record**: 3 specific bullet points of their most impressive completed projects or realized metrics.
    3. **Expertise locked**: List the core skills they have already mastered.
    
    Do not speculate on future potential here. Focus on the evidence of the past.
    """
    return _generate(prompt)

def generate_interview_questions(text: str, role_context: str | None = None, company_context: str | None = None) -> str:
    role_description = role_context if role_context else "General Fit for this candidate's profile"
    company_info = f" at {company_context}" if company_context else ""
    
    prompt = f"""
    You are a Hiring Manager{company_info}.
    
    Candidate Resume:
    "{text[:4000]}"
    
    Target Context: {role_description}{company_info}.
    
    Generate 5 interview questions that bridge the gap between their Current Resume and this Context.
    
    Format in Markdown:
    1. **Question**: The question.
    2. **Rationale**: Why ask this?
    3. **Ideal Answer Key**: What key points should they hit?
    """
    return _generate(prompt)

def generate_cover_letter(text: str, target_role_description: str | None = None, target_company: str | None = None) -> str:
    role_desc = target_role_description if target_role_description else "a role matching my skills"
    company_info = f" at {target_company}" if target_company else ""
    
    prompt = f"""
    You are a Strategic Career Consultant.
    
    Candidate Resume:
    "{text[:4000]}"
    
    Target Job/Context:
    "{role_desc}"{company_info}
    
    Don't just write a generic letter. Provide a **STRATEGY** for the cover letter.
    
    Format as Markdown:
    1. **The Hook**: A suggested opening sentence that grabs attention.
    2. **What to INCLUDE**: 3 specific achievements from the resume that directly prove they can do this specific job.
    3. **What to EXCLUDE**: What parts of their resume are irrelevant for this specific role and should be de-emphasized in the letter?
    4. **The Draft**: Now, write the actual concise cover letter incorporating these points.
    """
    return _generate(prompt)

def enhance_resume_text(text: str, target_role: str | None = None, target_company: str | None = None, reference_matches: list | None = None) -> str:
    target = target_role if target_role else "Market Standard for similar senior roles"
    company_info = f" targeting {target_company}" if target_company else ""
    
    prompt = f"""
    You are a nice "Future Skills" Coach.
    
    Candidate Resume:
    "{text[:4000]}"
    
    Target Role/Goal: {target}{company_info}
    
    Focus ONLY on **FUTURE GROWTH** ("What else technology/skills he can learn").
    
    Format as Markdown:
    1. **Missing Tech Stack**: List 3 specific modern technologies or tools this candidate usually needs for a {target} but currently lacks.
    2. **Skill Upgrade Path**: Recommend a specific learning path (e.g., "Learn X to complement your Y").
    3. **Resume Addition**: Write a sample "Skills" section entry that they *could* have after 3 months of study.
    """
    return _generate(prompt)

def chat_with_ai_assistant(message: str, resume_text: str | None = None, vector_context: str | None = None) -> str:
    # Context Construction
    context_section = ""
    if resume_text:
        context_section += f"\n\nCURRENT USER RESUME:\n{resume_text[:2000]}...\n(Use this to answer questions about the user's background)"
    
    if vector_context:
        context_section += f"\n\nRELEVANT MARKET EXAMPLES/KNOWLEDGE:\n{vector_context}\n(Use this to provide broader market context)"

    prompt = f"""
    You are the intelligent and friendly AI-Guide for the 'Career Atlas' platform.
    
    Your Goal: Help users navigate the platform and explain its features. 
    IMPORTANT: You are a GUIDE. Do NOT generate resumes, cover letters, or interviews yourself here. Always direct the user to the specific tools in the app for those tasks.
    
    If the user asks for general career advice, keep it brief and point them to the 'Job Fit Analysis' or 'Interview Prep' tools.
    If the user asks unrelated questions (e.g. coding, math, general trivia), politely decline and remind them you are here to help with Career Atlas.
    
    Platform Features you can explain:
    1. Job Fit Analysis: Benchmarks resume against market roles.
    2. Smart Summary: Writes executive summaries.
    3. Role Enhancer: Optimizes keywords for specific roles.
    4. Interview Prep: Generates questions.
    5. Cover Letter: Writes cover letters.
    6. Job Scout: Searches specifically for jobs.
    
    CONTEXT:{context_section}
    
    User Message: "{message}"
    
    Provide a helpful, concise, and encouraging response. Use Markdown. 
    If you used the Market Examples, mention that you found similar patterns in the database.
    """
    return _generate(prompt)

def extract_text_from_image(image_bytes: bytes, mime_type: str) -> str:
    """
    Uses Gemini Vision capabilities to extract text from an image (OCR).
    """
    try:
        if settings.GEMINI_API_KEY:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            model = genai.GenerativeModel('gemini-2.5-flash')
            
            prompt = "Please accurately transcribe all the text found in this resume image. Preserve the structure as much as possible using Markdown."
            
            response = model.generate_content([
                prompt,
                {
                    "mime_type": mime_type,
                    "data": image_bytes
                }
            ])
            return response.text
            
        elif settings.OPENROUTER_API_KEY:
             # OpenRouter also supports multimodal, but for simplicity/reliability with file bytes, 
             # we'll stick to direct Gemini if available, or return a placeholder if not.
             # true multimodal handling via OpenRouter standard API usually requires base64 or URLs.
             # For this specific 'playground' setup, we assume Gemini Direct is the primary driver for vision.
             return "OCR Feature requires GEMINI_API_KEY"
             
        else:
            return "Error: No API Key configured for OCR."
            
    except Exception as e:
        return f"Error extracting text from image: {str(e)}"
