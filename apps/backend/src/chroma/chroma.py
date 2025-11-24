import chromadb

chroma_client = chromadb.HttpClient(host="localhost", port=9000)


chroma_collection = chroma_client.get_or_create_collection("intellimeetings")
