from fastapi import FastAPI, Request, HTTPException
from pydantic import BaseModel
from typing import List
from openai import OpenAI # We can use the OpenAI library with OpenRouter
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

OPENROUTER_API_KEY = os.getenv("R1")

if not OPENROUTER_API_KEY:
    print("ERROR: OpenRouter API key (R1) not found in .env file.")
   
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=OPENROUTER_API_KEY,
   
)

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Event(BaseModel):
    id: str
    title: str
    date: str
    location: str
    status: str
    description: str

class ChatRequest(BaseModel):
    message: str
    events: List[Event]

@app.post("/chat")
async def chat(request: ChatRequest):
    if not OPENROUTER_API_KEY:
        raise HTTPException(status_code=500, detail="OpenRouter API key not configured.")

    event_data = "\n".join(
        [f"- Title: {e.title}, Date: {e.date}, Location: {e.location}, Status: {e.status}, Description: {e.description}" for e in request.events]
    )

    prompt = f"""
You are an assistant for an event planner app.
Based on the following events, answer the user's question.

Events:
{event_data if event_data else "No events provided."}

User question: {request.message}

Answer:
    """

    try:
       
        chosen_model = "mistralai/mistral-7b-instruct-v0.1"
        
        completion = client.chat.completions.create(
            model=chosen_model,
            messages=[
               {"role": "user", "content": prompt}
            ],
            temperature=0.3,
        )
        reply = completion.choices[0].message.content

    except Exception as e:
        print(f"Error calling OpenRouter API: {e}")
        detail_message = str(e)
        if "authentication" in detail_message.lower():
            raise HTTPException(status_code=401, detail=f"OpenRouter authentication error: {detail_message}")
        elif "rate limit" in detail_message.lower():
            raise HTTPException(status_code=429, detail=f"OpenRouter rate limit exceeded: {detail_message}")
        elif "not found" in detail_message.lower() and "model" in detail_message.lower():
             raise HTTPException(status_code=404, detail=f"Model '{chosen_model}' not found or not accessible on OpenRouter: {detail_message}")
        else:
            raise HTTPException(status_code=503, detail=f"Error communicating with OpenRouter: {detail_message}")

    return {"reply": reply}