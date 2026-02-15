from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List
import uuid
from datetime import datetime
from emergentintegrations.llm.chat import LlmChat, UserMessage


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

class MonthlyReflectionRequest(BaseModel):
    entries: List[dict]  # List of entries for the month
    month: str  # e.g., "January 2025"

class MonthlyReflectionResponse(BaseModel):
    summary: str
    month: str

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

@api_router.post("/monthly-reflection", response_model=MonthlyReflectionResponse)
async def generate_monthly_reflection(request: MonthlyReflectionRequest):
    """
    Generate AI-powered monthly reflection summary.
    This feature provides a passive, reflective summary without advice or diagnosis.
    """
    try:
        if not request.entries:
            raise HTTPException(status_code=400, detail="No entries provided for reflection")
        
        # Format entries for AI analysis
        entries_text = "\n\n".join([
            f"Date: {entry.get('date', 'Unknown')}\n"
            f"Question: {entry.get('question', 'N/A')}\n"
            f"Answer: {entry.get('answer', 'N/A')}\n"
            f"Mood: {entry.get('mood', 'None')}"
            for entry in request.entries
        ])
        
        # System message for neutral, reflective tone
        system_message = """
You are a neutral reflection assistant for a daily journaling app called OneThing.

Your role is to:
- Detect recurring themes and patterns in user's answers
- Summarize emotional patterns neutrally
- Reflect language back to the user

You MUST NOT:
- Give advice or recommendations
- Diagnose mental health conditions
- Use motivational or therapeutic language
- Suggest actions or changes
- Make judgments or evaluations

Tone: Neutral, descriptive, reflective, non-judgmental.
Length: 3-5 sentences maximum.

Example style:
"This month, your answers often referenced tiredness around work and moments of relief during quieter days. Several entries reflected a desire for fewer obligations. This summary simply reflects recurring themes without judgment."
"""
        
        user_message_text = f"""
Please analyze these journal entries from {request.month} and provide a neutral, reflective summary:

{entries_text}

Provide a brief, neutral summary of recurring themes and patterns.
"""
        
        # Initialize AI chat with Emergent Universal Key
        api_key = os.environ.get('EMERGENT_LLM_KEY')
        if not api_key:
            raise HTTPException(status_code=500, detail="AI service not configured")
        
        chat = LlmChat(
            api_key=api_key,
            session_id=f"monthly-reflection-{datetime.now().timestamp()}",
            system_message=system_message
        ).with_model("openai", "gpt-5.2")
        
        user_message = UserMessage(text=user_message_text)
        response = await chat.send_message(user_message)
        
        return MonthlyReflectionResponse(
            summary=response,
            month=request.month
        )
    
    except Exception as e:
        logging.error(f"Error generating monthly reflection: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate reflection: {str(e)}")

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
