from app.retrieval.retriever import Retriever, get_retriever
from app.generation.llm import generate_interview_questions, generate_cover_letter
from app.api.schemas.generator import GenerationRequest, GenerationResult
from fastapi import Depends

class GeneratorService:
    def __init__(self, retriever: Retriever):
        self.retriever = retriever

    def generate_interview(self, request: GenerationRequest) -> GenerationResult:
        matches = self.retriever.get_role_context(request.target_role, limit=3)
        context_snippets = [m['snippet'][:300] for m in matches]
        role_context = f"Role: {request.target_role}. \nContext from industry profiles: {' '.join(context_snippets)}"
        
        result = generate_interview_questions(request.resume_text, role_context, request.target_company)
        return GenerationResult(result_md=result)

    def generate_letter(self, request: GenerationRequest) -> GenerationResult:
        matches = self.retriever.get_role_context(request.target_role, limit=3)
        context_snippets = [m['snippet'] for m in matches]
        target_role_description = f"Position: {request.target_role}.\n\nTypical industry Requirements (RAG-retrieved):\n" + "\n---\n".join(context_snippets)
        
        result = generate_cover_letter(request.resume_text, target_role_description, request.target_company)
        return GenerationResult(result_md=result)

def get_generator_service(retriever: Retriever = Depends(get_retriever)) -> GeneratorService:
    return GeneratorService(retriever)
