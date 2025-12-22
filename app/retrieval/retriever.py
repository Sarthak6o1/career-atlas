from app.vectorstore.chroma import get_chroma_collection, get_chroma_client
from app.ingestion.embedding import get_embedding_function

class Retriever:
    def __init__(self, collection=None, embedding_fn=None):
        if collection is None:
            client = get_chroma_client()
            self.collection = get_chroma_collection(client)
        else:
            self.collection = collection
            
        self.embedding_fn = embedding_fn or get_embedding_function()

    def query_similar_documents(self, query_text: str, n_results: int = 5, where: dict = None, where_document: dict = None):
        """
        Generic query method for the vector store.
        """
        query_embedding = self.embedding_fn([query_text])
        
        results = self.collection.query(
            query_embeddings=query_embedding,
            n_results=n_results,
            where=where,
            where_document=where_document
        )
        
        # Parse results into a friendly format
        parsed_results = []
        if results['ids']:
            ids = results['ids'][0]
            metadatas = results['metadatas'][0]
            documents = results['documents'][0]
            distances = results['distances'][0]
            
            for i in range(len(ids)):
                parsed_results.append({
                    "id": ids[i],
                    "score": 1 - distances[i],
                    "metadata": metadatas[i],
                    "snippet": documents[i]
                })
                
        return parsed_results

    def get_similar_profiles(self, resume_text: str, limit: int = 5) -> list:
        """
        Finds profiles similar to the resume text. 
        Filters for unique categories in the response.
        """
        raw_matches = self.query_similar_documents(resume_text, n_results=limit * 2) # Fetch more to filter
        
        seen_categories = set()
        unique_matches = []
        
        for match in raw_matches:
            category = match['metadata'].get('category', 'Unknown')
            if category not in seen_categories:
                seen_categories.add(category)
                # Truncate snippet for display
                match['snippet'] = match['snippet'][:200] + "..."
                unique_matches.append(match)
        
        return unique_matches[:limit]

    def get_role_context(self, role_name: str, limit: int = 5) -> list:
        """
        Finds profiles that match a specific job role to serve as context/references.
        """
        raw_matches = self.query_similar_documents(role_name, n_results=limit)
        return raw_matches

def get_retriever():
    return Retriever()
