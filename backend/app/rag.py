import os
import json
import faiss
import numpy as np
import google.generativeai as genai
from pypdf import PdfReader
from app.config import GEMINI_API_KEY, KNOWLEDGE_BASE_DIR, FAISS_INDEX_PATH, CHUNKS_MAP_PATH

genai.configure(api_key=GEMINI_API_KEY)
DIMENSION = 3072

def chunk_text(text, chunk_size=800, chunk_overlap=150):
    paragraphs = text.split("\n\n")
    chunks = []
    current_chunk = ""
    for paragraph in paragraphs:
        paragraph = paragraph.strip()
        if not paragraph:
            continue
        if len(current_chunk) + len(paragraph) <= chunk_size:
            current_chunk += paragraph + "\n\n"
        else:
            if current_chunk:
                chunks.append(current_chunk.strip())
            if len(paragraph) > chunk_size:
                start = 0
                while start < len(paragraph):
                    chunks.append(paragraph[start:start+chunk_size])
                    start += (chunk_size - chunk_overlap)
                current_chunk = ""
            else:
                current_chunk = paragraph + "\n\n"
    if current_chunk:
        chunks.append(current_chunk.strip())
    return chunks

def extract_text_from_file(file_path):
    ext = os.path.splitext(file_path)[1].lower()
    text = ""
    if ext == ".pdf":
        reader = PdfReader(file_path)
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    elif ext in [".txt", ".md"]:
        with open(file_path, "r", encoding="utf-8") as f:
            text = f.read()
    return text

def get_embeddings(texts):
    if not texts:
        return []
    embeddings = []
    batch_size = 100
    for i in range(0, len(texts), batch_size):
        batch = texts[i:i+batch_size]
        response = genai.embed_content(
            model="models/gemini-embedding-001",
            content=batch,
            task_type="retrieval_document"
        )
        embeddings.extend(response["embedding"])
    return embeddings

def get_query_embedding(query):
    response = genai.embed_content(
        model="models/gemini-embedding-001",
        content=query,
        task_type="retrieval_query"
    )
    return response["embedding"]

def save_index(index, chunks_map):
    faiss.write_index(index, FAISS_INDEX_PATH)
    with open(CHUNKS_MAP_PATH, "w", encoding="utf-8") as f:
        json.dump(chunks_map, f, ensure_ascii=False)

def load_index():
    if not os.path.exists(FAISS_INDEX_PATH) or not os.path.exists(CHUNKS_MAP_PATH):
        return None, []
    try:
        index = faiss.read_index(FAISS_INDEX_PATH)
        with open(CHUNKS_MAP_PATH, "r", encoding="utf-8") as f:
            chunks_map = json.load(f)
        return index, chunks_map
    except Exception:
        return None, []

def rebuild_rag_index():
    all_chunks = []
    chunks_map = []
    
    if not os.path.exists(KNOWLEDGE_BASE_DIR):
        os.makedirs(KNOWLEDGE_BASE_DIR)
        
    for filename in os.listdir(KNOWLEDGE_BASE_DIR):
        file_path = os.path.join(KNOWLEDGE_BASE_DIR, filename)
        if os.path.isdir(file_path):
            continue
        try:
            text = extract_text_from_file(file_path)
            if not text.strip():
                continue
            file_chunks = chunk_text(text)
            for chunk in file_chunks:
                all_chunks.append(chunk)
                chunks_map.append({
                    "text": chunk,
                    "source": filename
                })
        except Exception:
            continue
            
    if not all_chunks:
        if os.path.exists(FAISS_INDEX_PATH):
            os.remove(FAISS_INDEX_PATH)
        if os.path.exists(CHUNKS_MAP_PATH):
            os.remove(CHUNKS_MAP_PATH)
        return False
        
    embeddings = get_embeddings(all_chunks)
    embeddings_array = np.array(embeddings).astype("float32")
    
    index = faiss.IndexFlatL2(DIMENSION)
    index.add(embeddings_array)
    
    save_index(index, chunks_map)
    return True

def search_similar_chunks(query, k=4):
    index, chunks_map = load_index()
    if index is None or not chunks_map:
        return []
    try:
        query_vector = get_query_embedding(query)
        query_vector_array = np.array([query_vector]).astype("float32")
        distances, indices = index.search(query_vector_array, k)
        results = []
        for idx in indices[0]:
            if idx != -1 and idx < len(chunks_map):
                results.append(chunks_map[idx])
        return results
    except Exception:
        return []
