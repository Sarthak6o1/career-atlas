import os
import sys
import pandas as pd
import uuid
import re
from dotenv import load_dotenv

# Add project root to path so we can import app modules
sys.path.append(os.getcwd())
load_dotenv()

from app.vectorstore.chroma import get_chroma_client
from app.ingestion.embedding import get_embedding_function

def clean_text(text):
    """
    Clean resume text by removing special characters and extra spaces.
    """
    if not isinstance(text, str):
        return ""
    
    # Remove special characters often found in parsed text (like â€¢)
    text = re.sub(r'[^\x00-\x7F]+', ' ', text)
    
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def ingest_data(file_path):
    print(f"Reading data from {file_path}...")
    
    try:
        if file_path.endswith('.csv'):
            df = pd.read_csv(file_path)
        else:
            print("Unsupported file format. Please use CSV.")
            return
            
        # Standardize column names
        # Kaggle dataset usually has 'Category' and 'Resume'
        if 'Category' not in df.columns or 'Resume' not in df.columns:
            print(f"Error: CSV must contain 'Category' and 'Resume' columns. Found: {df.columns}")
            return
            
        print(f"Found {len(df)} resumes. Cleaning and embedding...")
        
        # Initialize Embeddings
        ef = get_embedding_function()
        
        # Get Client and Collection using the new functional pattern
        client = get_chroma_client()
        collection = client.get_or_create_collection(
            name="resumes",
            embedding_function=ef
        )
        
        # Prepare Batch
        ids = []
        documents = []
        metadatas = []
        
        for index, row in df.iterrows():
            text = clean_text(row['Resume'])
            category = row['Category']
            
            if not text:
                continue
                
            # Create a simple ID
            doc_id = str(uuid.uuid4())
            
            ids.append(doc_id)
            documents.append(text)
            metadatas.append({"category": category, "source": "kaggle"})
            
            # Batch process every 100 items
            if len(ids) >= 100:
                collection.add(ids=ids, documents=documents, metadatas=metadatas)
                print(f"Ingested {index + 1} / {len(df)} resumes...")
                ids = []
                documents = []
                metadatas = []
                
        # Final batch
        if ids:
            collection.add(ids=ids, documents=documents, metadatas=metadatas)

            
        print(f"Successfully ingested {len(df)} resumes into ChromaDB collection 'resumes'.")
        
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    # check if data folder has the file, else ask user
    default_path = "data/UpdatedResumeDataSet.csv" 
    
    if os.path.exists(default_path):
        ingest_data(default_path)
    else:
        # Fallback to checking specific download path if user provided (simulated here by message)
        # In a real scenario, we might ask for input. 
        # For now, we print instructions.
        print(f"File not found at {default_path}.")
        print("Please place your 'UpdatedResumeDataSet.csv' in the 'data/' folder.")
        
        # Allow command line arg
        if len(sys.argv) > 1:
            ingest_data(sys.argv[1])
