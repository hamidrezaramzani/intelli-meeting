import chromadb
from src.config import settings
chroma_client = chromadb.HttpClient(host=settings.CHROMA_HOST, port=settings.CHROMA_PORT)


chroma_collection = chroma_client.get_or_create_collection("intellimeetings")
