from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List
import chromadb
from app.vectorstore.chroma import get_chroma_collection

router = APIRouter()

class AiAssistantRequest(BaseModel):
    message: str
    resume_text: Optional[str] = None

class SourceItem(BaseModel):
    source: str
    category: str
    snippet: str

class AiAssistantResponse(BaseModel):
    reply: str
    sources: List[SourceItem] = []

@router.post("/chat", response_model=AiAssistantResponse)
def chat_ai_assistant(request: AiAssistantRequest, collection = Depends(get_chroma_collection)):
    try:
        from app.generation.llm import chat_with_ai_assistant
        
        # 1. RAG Retrieval
        vector_context = ""
        sources_list = []
        
        try:
            results = collection.query(
                query_texts=[request.message],
                n_results=3,
                include=["documents", "metadatas"]
            )
            
            if results and results['documents']:
                docs = results['documents'][0]
                metas = results['metadatas'][0]
                
                context_parts = []
                for i, doc in enumerate(docs):
                    meta = metas[i] if i < len(metas) else {}
                    category = meta.get('category', 'Unknown')
                    
                    # Create source item for response
                    sources_list.append(SourceItem(
                        source=f"Resume DB Match #{i+1}",
                        category=category,
                        snippet=doc[:150] + "..."
                    ))
                    
                    context_parts.append(f"Match [{category}]: {doc}")
                
                vector_context = "\n---\n".join(context_parts)
                
        except Exception as db_err:
            print(f"RAG Warning: {db_err}")
            # Continue without RAG if DB fails
        
        # 2. Generation
        reply = chat_with_ai_assistant(
            message=request.message, 
            resume_text=request.resume_text,
            vector_context=vector_context
        )
        
        return AiAssistantResponse(reply=reply, sources=sources_list)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
