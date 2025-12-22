import os
import chromadb
from fastapi import Depends
from dotenv import load_dotenv

load_dotenv()

_client = None
_collection = None


def get_chroma_client():
    global _client
    if _client is None:
        _client = chromadb.CloudClient(
            api_key=os.getenv("CHROMA_API_KEY"),
            tenant=os.getenv("CHROMA_TENANT"),
            database=os.getenv("CHROMA_DATABASE"),
        )
    return _client


def get_chroma_collection(
    client=Depends(get_chroma_client),
):
    global _collection
    if _collection is None:
        _collection = client.get_or_create_collection("resumes")
    return _collection
