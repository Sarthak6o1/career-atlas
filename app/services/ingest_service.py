from app.vectorstore.chroma import get_chroma_collection
from app.ingestion.loaders.pdf import parse_pdf
from app.ingestion.loaders.image import parse_image
from app.api.schemas.ingest import IngestBatchRequest, IngestResult, ParseResult
from fastapi import Depends, UploadFile
from chromadb.api.models.Collection import Collection

class IngestService:
    def __init__(self, collection: Collection):
        self.collection = collection

    async def batch_ingest(self, request: IngestBatchRequest) -> IngestResult:
        self.collection.add(
            ids=request.ids,
            documents=request.documents,
            metadatas=request.metadatas
        )
        return IngestResult(
            message=f"Successfully added {len(request.ids)} documents",
            ids=request.ids,
            count=len(request.ids)
        )

    async def parse_file(self, file: UploadFile, contents: bytes) -> ParseResult:
        if file.filename.lower().endswith('.pdf'):
            text = parse_pdf(contents)
        elif file.filename.lower().endswith(('.jpg', '.jpeg', '.png')):
            mime_type = file.content_type or "image/jpeg"
            text = parse_image(contents, mime_type)
        else:
            # Text or Markdown
            text = contents.decode('utf-8', errors='ignore')
        
        if not text or len(text.strip()) < 50:
            raise ValueError("Could not extract sufficient text from file.")
            
        from app.ingestion.chunker import chunk_text
        chunks = chunk_text(text, chunk_size=2000, overlap=200)
        
        optimized_text = "\n\n".join(chunks)
        
        return ParseResult(text=optimized_text, filename=file.filename)

def get_ingest_service(collection: Collection = Depends(get_chroma_collection)) -> IngestService:
    return IngestService(collection)
