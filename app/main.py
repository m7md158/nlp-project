"""
FastAPI application for T5 dialogue summarization model.
"""
import os
import torch
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field
from transformers import T5ForConditionalGeneration, T5Tokenizer
from typing import Optional

from app.preprocessing import preprocessing_text

# Initialize FastAPI app
app = FastAPI(
    title="T5 Dialogue Summarization API",
    description="API for summarizing dialogues using fine-tuned T5 model",
    version="1.0.0"
)

# Mount static files directory
app.mount("/static", StaticFiles(directory="static"), name="static")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables for model and tokenizer
model = None
tokenizer = None
device = None

# Default model parameters (from training notebook)
DEFAULT_MAX_INPUT_LEN = 512  # Safe default, can be adjusted
DEFAULT_MAX_TARGET_LEN = 128  # Safe default for summaries


class SummarizeRequest(BaseModel):
    """Request model for summarization endpoint."""
    text: str = Field(..., description="Input text to summarize", min_length=1)
    max_length: Optional[int] = Field(150, description="Maximum length of summary", ge=10, le=512)
    min_length: Optional[int] = Field(40, description="Minimum length of summary", ge=1, le=200)


class SummarizeResponse(BaseModel):
    """Response model for summarization endpoint."""
    summary: str


@app.on_event("startup")
async def load_model():
    """
    Load the T5 model and tokenizer at application startup.
    This ensures the model is loaded only once and reused for all requests.
    """
    global model, tokenizer, device
    
    model_path = "models/t5_summarizer_model"
    
    if not os.path.exists(model_path):
        raise FileNotFoundError(
            f"Model not found at {model_path}. "
            "Please ensure the model is saved in the correct location."
        )
    
    print(f"Loading model from {model_path}...")
    
    try:
        # Load tokenizer
        tokenizer = T5Tokenizer.from_pretrained(model_path)
        
        # Load model
        model = T5ForConditionalGeneration.from_pretrained(model_path)
        
        # Set device (CPU for this deployment)
        device = torch.device("cpu")
        model.to(device)
        model.eval()  # Set to evaluation mode
        
        print("Model loaded successfully!")
        print(f"Model device: {device}")
        
    except Exception as e:
        print(f"Error loading model: {str(e)}")
        raise


@app.get("/")
async def root():
    """Root endpoint that serves the frontend."""
    return FileResponse("static/index.html")


@app.get("/index.html")
async def index():
    """Serve index.html explicitly."""
    return FileResponse("static/index.html")


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "model_loaded": model is not None and tokenizer is not None
    }


@app.post("/summarize", response_model=SummarizeResponse)
async def summarize(request: SummarizeRequest):
    """
    Summarize the input text using the fine-tuned T5 model.
    
    Args:
        request: SummarizeRequest containing text and optional parameters
        
    Returns:
        SummarizeResponse containing the generated summary
        
    Raises:
        HTTPException: If model is not loaded or inference fails
    """
    if model is None or tokenizer is None:
        raise HTTPException(
            status_code=503,
            detail="Model not loaded. Please check server logs."
        )
    
    try:
        # Preprocess the input text
        preprocessed_text = preprocessing_text(request.text)
        
        # Add the "summarize: " prefix (as used in training)
        input_text = "summarize: " + preprocessed_text
        
        # Tokenize input
        inputs = tokenizer(
            input_text,
            return_tensors="pt",
            truncation=True,
            padding="max_length",
            max_length=DEFAULT_MAX_INPUT_LEN
        )
        
        # Move inputs to device
        inputs = {k: v.to(device) for k, v in inputs.items()}
        
        # Generate summary
        with torch.no_grad():
            outputs = model.generate(
                inputs["input_ids"],
                attention_mask=inputs["attention_mask"],
                max_length=request.max_length,
                min_length=request.min_length,
                num_beams=4,
                length_penalty=2.0,
                do_sample=False,
                no_repeat_ngram_size=3,
                early_stopping=True
            )
        
        # Decode the generated summary
        summary = tokenizer.decode(outputs[0], skip_special_tokens=True)
        
        return SummarizeResponse(summary=summary)
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error during summarization: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

