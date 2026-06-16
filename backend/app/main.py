import os
import shutil
from fastapi import FastAPI, Depends, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.config import KNOWLEDGE_BASE_DIR
from app.database import init_db, get_db, Volunteer, Internship, Document, QueryLog, Subscription
from app.rag import rebuild_rag_index, search_similar_chunks
from app.gemini import generate_bot_response

app = FastAPI(title="NayePankh Foundation AI Chatbot API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

init_db()

try:
    rebuild_rag_index()
except Exception:
    pass

def detect_language(text):
    for char in text:
        if "\u0900" <= char <= "\u097f":
            return "hi"
    return "en"

@app.post("/api/chat")
async def chat_endpoint(payload: dict, db: Session = Depends(get_db)):
    query = payload.get("query", "").strip()
    session_id = payload.get("session_id", "").strip()
    
    if not query or not session_id:
        raise HTTPException(status_code=400, detail="Missing query or session_id")
        
    db_history = db.query(QueryLog).filter(QueryLog.session_id == session_id).order_by(QueryLog.timestamp.desc()).limit(5).all()
    db_history.reverse()
    
    history = []
    for q in db_history:
        history.append({"role": "user", "content": q.query_text})
        history.append({"role": "assistant", "content": q.response_text})
        
    similar_chunks = search_similar_chunks(query, k=4)
    context = "\n\n".join([c["text"] for c in similar_chunks])
    
    response_text = generate_bot_response(query, context, history)
    
    lang = detect_language(query)
    
    new_log = QueryLog(
        session_id=session_id,
        query_text=query,
        response_text=response_text,
        language=lang
    )
    db.add(new_log)
    db.commit()
    
    return {
        "response": response_text,
        "language": lang,
        "sources": list(set([c["source"] for c in similar_chunks]))
    }

@app.post("/api/volunteer")
async def register_volunteer(payload: dict, db: Session = Depends(get_db)):
    name = payload.get("name", "").strip()
    email = payload.get("email", "").strip()
    phone = payload.get("phone", "").strip()
    city = payload.get("city", "").strip()
    interests = payload.get("interests", "")
    
    if not name or not email or not phone or not city or not interests:
        raise HTTPException(status_code=400, detail="All fields are required")
        
    volunteer = Volunteer(
        name=name,
        email=email,
        phone=phone,
        city=city,
        interests=str(interests)
    )
    db.add(volunteer)
    db.commit()
    return {"status": "success", "message": "Volunteer registration successful"}

@app.post("/api/internship")
async def register_internship(payload: dict, db: Session = Depends(get_db)):
    name = payload.get("name", "").strip()
    email = payload.get("email", "").strip()
    college = payload.get("college", "").strip()
    course = payload.get("course", "").strip()
    year_of_study = payload.get("year_of_study", "").strip()
    skills = payload.get("skills", "").strip()
    resume_link = payload.get("resume_link", "").strip()
    
    if not name or not email or not college or not course or not year_of_study or not skills:
        raise HTTPException(status_code=400, detail="Required fields are missing")
        
    internship = Internship(
        name=name,
        email=email,
        college=college,
        course=course,
        year_of_study=year_of_study,
        skills=skills,
        resume_link=resume_link if resume_link else None
    )
    db.add(internship)
    db.commit()
    return {"status": "success", "message": "Internship application submitted successfully"}

@app.post("/api/subscribe")
async def subscribe_endpoint(payload: dict, db: Session = Depends(get_db)):
    email = payload.get("email", "").strip()
    if not email:
        raise HTTPException(status_code=400, detail="Email is required")
    existing = db.query(Subscription).filter(Subscription.email == email).first()
    if not existing:
        new_sub = Subscription(email=email)
        db.add(new_sub)
        db.commit()
    return {"status": "success", "message": "Subscribed successfully!"}

@app.post("/api/admin/upload")
async def upload_document(file: UploadFile = File(...), db: Session = Depends(get_db)):
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in [".pdf", ".txt", ".md"]:
        raise HTTPException(status_code=400, detail="Only PDF, TXT, and MD files are supported")
        
    file_path = os.path.join(KNOWLEDGE_BASE_DIR, file.filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    db_doc = db.query(Document).filter(Document.filename == file.filename).first()
    if not db_doc:
        db_doc = Document(
            filename=file.filename,
            file_type=ext[1:].upper(),
            status="Uploaded"
        )
        db.add(db_doc)
    else:
        db_doc.status = "Uploaded"
    db.commit()
    
    return {"status": "success", "filename": file.filename}

@app.get("/api/admin/documents")
async def list_documents(db: Session = Depends(get_db)):
    docs = db.query(Document).order_by(Document.uploaded_at.desc()).all()
    
    # Sync with files actually in folder
    folder_files = set(os.listdir(KNOWLEDGE_BASE_DIR))
    db_files = {doc.filename for doc in docs}
    
    # Add files that exist in folder but not in db
    for filename in folder_files:
        if filename not in db_files:
            ext = os.path.splitext(filename)[1].lower()
            if ext in [".pdf", ".txt", ".md"]:
                new_doc = Document(
                    filename=filename,
                    file_type=ext[1:].upper(),
                    status="Pending"
                )
                db.add(new_doc)
                db.commit()
                
    docs = db.query(Document).order_by(Document.uploaded_at.desc()).all()
    return [{"id": d.id, "filename": d.filename, "file_type": d.file_type, "uploaded_at": d.uploaded_at.isoformat(), "status": d.status} for d in docs]

@app.post("/api/admin/rebuild-index")
async def trigger_rebuild(db: Session = Depends(get_db)):
    success = rebuild_rag_index()
    if success:
        db.query(Document).filter(Document.status == "Uploaded").update({"status": "Indexed"})
        db.query(Document).filter(Document.status == "Pending").update({"status": "Indexed"})
        db.commit()
        return {"status": "success", "message": "FAISS index rebuilt successfully"}
    else:
        return {"status": "error", "message": "Failed to rebuild index. Knowledge base might be empty."}

@app.get("/api/analytics")
async def get_analytics(db: Session = Depends(get_db)):
    total_conversations = db.query(func.count(func.distinct(QueryLog.session_id))).scalar() or 0
    total_users = total_conversations
    total_volunteers = db.query(func.count(Volunteer.id)).scalar() or 0
    total_internships = db.query(func.count(Internship.id)).scalar() or 0
    total_subscribers = db.query(func.count(Subscription.id)).scalar() or 0
    
    top_queries_db = db.query(
        QueryLog.query_text,
        func.count(QueryLog.id).label("count")
    ).group_by(
        QueryLog.query_text
    ).order_by(
        func.count(QueryLog.id).desc()
    ).limit(10).all()
    
    top_queries = [{"query": q[0], "count": q[1]} for q in top_queries_db]
    
    return {
        "total_conversations": total_conversations,
        "total_users": total_users,
        "total_volunteers": total_volunteers,
        "total_internships": total_internships,
        "total_subscribers": total_subscribers,
        "top_queries": top_queries
    }
