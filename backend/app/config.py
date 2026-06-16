import os
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
DATABASE_DIR = os.path.join(BASE_DIR, "database")
os.makedirs(DATABASE_DIR, exist_ok=True)
DATABASE_URL = f"sqlite:///{os.path.join(DATABASE_DIR, 'nayepankh.db')}"

KNOWLEDGE_BASE_DIR = os.path.join(BASE_DIR, "knowledge_base")
os.makedirs(KNOWLEDGE_BASE_DIR, exist_ok=True)

FAISS_DIR = os.path.join(BASE_DIR, "backend", "faiss_index")
os.makedirs(FAISS_DIR, exist_ok=True)
FAISS_INDEX_PATH = os.path.join(FAISS_DIR, "index.faiss")
CHUNKS_MAP_PATH = os.path.join(FAISS_DIR, "chunks.json")
