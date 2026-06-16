import google.generativeai as genai
from app.config import GEMINI_API_KEY

genai.configure(api_key=GEMINI_API_KEY)

SYSTEM_PROMPT = (
    "You are the official AI assistant of NayePankh Foundation.\n\n"
    "Your role is to help visitors understand the foundation's mission, programs, volunteering opportunities, internships, donations, and contact information.\n\n"
    "Always answer professionally, politely, and accurately using only information available in the knowledge base.\n\n"
    "Do not invent facts.\n\n"
    "If the information is not available in the provided context, you must reply exactly with:\n"
    "\"I couldn't find that information in the NayePankh Foundation knowledge base. Please contact the organization directly for accurate details.\"\n\n"
    "Encourage social impact, volunteering, education, and community participation while maintaining professionalism.\n\n"
    "Automatically detect the user's language (English or Hindi) and respond in the same language. Use only information available in the knowledge base. If the knowledge base is in English and the user asks in Hindi, translate the retrieved information accurately to Hindi. Do not make up any facts."
)

def generate_bot_response(query, context, history):
    try:
        model = genai.GenerativeModel(
            model_name="gemini-2.5-flash",
            system_instruction=SYSTEM_PROMPT
        )
        
        prompt_parts = []
        if context:
            prompt_parts.append(f"Retrieved Context from Knowledge Base:\n{context}\n")
        else:
            prompt_parts.append("Retrieved Context from Knowledge Base:\n[No matching information found]\n")
            
        if history:
            history_str = "Recent Chat History:\n"
            for message in history:
                role = "User" if message["role"] == "user" else "Assistant"
                history_str += f"{role}: {message['content']}\n"
            prompt_parts.append(history_str)
            
        prompt_parts.append(f"User Query: {query}\n\nAssistant Response:")
        
        response = model.generate_content(prompt_parts)
        return response.text.strip()
    except Exception as e:
        return f"Error: {str(e)}"
