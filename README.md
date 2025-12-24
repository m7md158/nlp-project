# AI-Powered Text Summarization System

A web-based application for automatic text summarization using a fine-tuned T5 (Text-To-Text Transfer Transformer) model. This system leverages advanced Natural Language Processing (NLP) techniques to generate concise and informative summaries of long-form text content.

---

## 1. Project Overview

### 1.1 Project Idea

This project addresses the challenge of information overload in the digital age by providing an automated solution for text summarization. The system utilizes a fine-tuned T5 transformer model to generate high-quality summaries of input text, enabling users to quickly grasp the essential information without reading through lengthy documents.

### 1.2 Problem Statement

In today's information-rich environment, individuals and organizations are constantly faced with large volumes of textual data, including:
- Research papers and academic articles
- Business reports and documents
- Customer conversations and dialogues
- News articles and online content
- Legal documents and transcripts

Manually summarizing such content is time-consuming and requires significant cognitive effort. Automated summarization systems can significantly reduce the time and effort required to extract key information from lengthy texts.

### 1.3 Importance of Text Summarization

Text summarization plays a crucial role in:
- **Information Retrieval**: Enabling quick access to essential information
- **Decision Making**: Helping users make informed decisions based on summarized content
- **Productivity Enhancement**: Reducing reading time and improving workflow efficiency
- **Accessibility**: Making complex content more digestible for diverse audiences
- **Knowledge Management**: Facilitating organization and storage of summarized information

### 1.4 AI and NLP in the Project

This project employs state-of-the-art Artificial Intelligence and Natural Language Processing techniques:

- **Transformer Architecture**: The T5 (Text-To-Text Transfer Transformer) model is based on the transformer architecture, which uses self-attention mechanisms to understand relationships between words in a text sequence.

- **Transfer Learning**: The model leverages pre-trained knowledge from large-scale datasets and is fine-tuned for the specific task of text summarization, allowing it to produce high-quality summaries with relatively less training data.

- **Sequence-to-Sequence Generation**: The system uses encoder-decoder architecture to map input text sequences to output summary sequences, enabling the generation of coherent and contextually appropriate summaries.

- **Deep Learning**: The neural network processes text through multiple layers of transformations, learning complex patterns and relationships in the language data.

---

## 2. System Architecture

### 2.1 Overall Architecture

The system follows a three-tier architecture pattern:

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Frontend  │────────▶│   Backend    │────────▶│  AI Model   │
│  (Browser)  │  HTTP   │   (FastAPI)  │  API    │  (T5 Model) │
│ HTML/CSS/JS │◀────────│   Python     │◀────────│  PyTorch    │
└─────────────┘         └──────────────┘         └─────────────┘
```

### 2.2 Data Flow

1. **User Input**: The user enters text through the web interface (HTML frontend).

2. **Frontend Processing**: JavaScript collects the input text and optional parameters (min_length, max_length) and sends a POST request to the backend API.

3. **Backend Reception**: FastAPI receives the HTTP request at the `/summarize` endpoint and validates the input using Pydantic models.

4. **Text Preprocessing**: The input text undergoes preprocessing (removal of URLs, emojis, file tags, and whitespace normalization) to match the training pipeline format.

5. **Model Input Preparation**: The preprocessed text is prefixed with "summarize: " (required by T5 architecture) and tokenized using the T5 tokenizer.

6. **Model Inference**: The tokenized input is passed to the fine-tuned T5 model, which generates a summary using beam search decoding on CPU.

7. **Response Generation**: The generated summary is decoded from tokens back to text and returned as a JSON response.

8. **Output Display**: The frontend receives the response and displays the summary to the user in the web interface.

### 2.3 Component Roles

- **FastAPI**: Provides a high-performance, asynchronous web framework for building the REST API. It handles HTTP requests, input validation, CORS, and serves static files for the frontend.

- **T5 Model**: The core AI component that performs the actual summarization. It is a fine-tuned transformer model that has been trained to understand context and generate coherent summaries.

- **PyTorch**: The deep learning framework that loads and executes the T5 model for inference.

- **HuggingFace Transformers**: Provides the pre-trained T5 model architecture, tokenizer, and utilities for model loading and text generation.

---

## 3. Project Structure

```
nlp_project/
├── app/
│   ├── __init__.py              # Python package initialization
│   ├── main.py                  # FastAPI application and API endpoints
│   └── preprocessing.py         # Text preprocessing utilities
│
├── static/
│   ├── index.html              # Frontend HTML interface
│   ├── style.css               # Frontend styling (CSS)
│   └── script.js               # Frontend JavaScript (API integration)
│
├── models/
│   └── t5_summarizer_model/    # Fine-tuned T5 model directory
│       ├── config.json         # Model configuration
│       ├── tokenizer_config.json
│       ├── special_tokens_map.json
│       ├── generation_config.json
│       ├── model.safetensors   # Model weights
│       ├── spiece.model        # SentencePiece tokenizer model
│       └── added_tokens.json
│
├── requirements.txt            # Python dependencies
├── run_server.py              # Server startup script
├── Project.ipynb              # Jupyter notebook (training/evaluation)
└── README.md                  # Project documentation
```

### 3.1 Directory and File Explanations

#### `/app`
Contains the backend application code:
- **`main.py`**: Defines the FastAPI application, API endpoints (`/summarize`, `/health`), model loading logic, and request/response handling.
- **`preprocessing.py`**: Contains utility functions for cleaning and preprocessing input text (removing URLs, emojis, file tags, normalizing whitespace).

#### `/static`
Contains the frontend web interface:
- **`index.html`**: The main HTML structure of the web application, including input textarea, parameter controls, and output display area.
- **`style.css`**: Cascading Style Sheets defining the visual design, layout, and responsive behavior of the interface.
- **`script.js`**: JavaScript code that handles user interactions, API calls to the backend, error handling, and dynamic content updates.

#### `/models/t5_summarizer_model`
**This directory stores the fine-tuned T5 model files:**
- **`model.safetensors`**: Contains the trained model weights and parameters (in SafeTensors format for security and efficiency).
- **`config.json`**: Defines the model architecture and hyperparameters.
- **`tokenizer_config.json`**: Configuration for the tokenizer used to convert text to model inputs.
- **`spiece.model`**: The SentencePiece tokenizer model file used for text tokenization.
- **`generation_config.json`**: Default parameters for text generation (beam search, length penalties, etc.).
- Other JSON files contain token mappings and special token definitions.

> **Note**: The model must be present in this directory for the application to function. The model is loaded once at server startup for efficient inference.

#### Root Files
- **`requirements.txt`**: Lists all Python package dependencies needed to run the project.
- **`run_server.py`**: Convenience script to start the FastAPI server using Uvicorn.
- **`Project.ipynb`**: Jupyter notebook used for model training, fine-tuning, and evaluation (if applicable).

---

## 4. How to Run the Project

### 4.1 Prerequisites

- **Python Version**: Python 3.8 or higher (Python 3.9+ recommended)
- **Operating System**: Windows, Linux, or macOS
- **Memory**: At least 4GB RAM (8GB+ recommended for model loading)
- **Storage**: Sufficient space for the model files (~500MB - 1GB)

### 4.2 Step-by-Step Instructions

#### Step 1: Clone or Navigate to the Project Directory

```bash
cd nlp_project
```

#### Step 2: Create a Virtual Environment

It is recommended to use a virtual environment to manage dependencies:

**On Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**On Linux/macOS:**
```bash
python3 -m venv venv
source venv/bin/activate
```

You should see `(venv)` in your terminal prompt, indicating the virtual environment is active.

#### Step 3: Install Dependencies

Install all required Python packages from the requirements file:

```bash
pip install -r requirements.txt
```


#### Step 4: Verify Model Directory

Ensure that the fine-tuned T5 model exists in the `models/t5_summarizer_model/` directory. The application will fail to start if the model files are missing.

#### Step 5: Run the FastAPI Server

You can start the server using one of the following methods:

**Option A: Using the provided script (Recommended)**
```bash
python run_server.py
```

**Option B: Using Uvicorn directly**
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

The `--reload` flag enables automatic reloading when code changes are detected (useful for development).

#### Step 6: Access the Application

**Access the frontend:**
- Open your web browser
- Navigate to: `http://localhost:8000`

**Alternative endpoints:**
- **API Documentation (Swagger UI)**: `http://localhost:8000/docs`
- **API Documentation (ReDoc)**: `http://localhost:8000/redoc`
- **Health Check**: `http://localhost:8000/health`




## 6. Example Usage

### 6.1 Example Input Text

Consider the following dialogue as input:

```
Hannah: Hey, do you have Betty's number?
Amanda: Lemme check
Amanda: Sorry, can't find it.
Hannah: Alright, no worries. I'll ask her directly when I see her tomorrow.
Amanda: That works! Let me know if you need anything else.
Hannah: Will do, thanks!
```

### 6.2 API Request (JSON)

When a user submits this text through the frontend or makes a direct API call, the request is formatted as follows:

```json
{
  "text": "Hannah: Hey, do you have Betty's number? 
          Amanda: Lemme check 
          Amanda: Sorry, can't find it. 
          Hannah: Alright, no worries. I'll ask her directly when I see her tomorrow. 
          Amanda: That works! Let me know if you need anything else. 
          Hannah: Will do, thanks!",
  "max_length": 150,
  "min_length": 40
}
```

**Using cURL:**
```bash
curl -X POST "http://localhost:8000/summarize" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hannah: Hey, do you have Betty'\''s number? Amanda: Lemme check Amanda: Sorry, can'\''t find it. Hannah: Alright, no worries. I'\''ll ask her directly when I see her tomorrow. Amanda: That works! Let me know if you need anything else. Hannah: Will do, thanks!",
    "max_length": 150,
    "min_length": 40
  }'
```

### 6.3 Example Output Summary

The model generates a concise summary:

```json
{
  "summary": "Hannah asks Amanda for Betty's number, but Amanda cannot find it. Hannah decides to ask Betty directly when she sees her tomorrow, and Amanda offers to help if needed."
}
```

### 6.4 How the Example Works

1. **Input Processing**: The dialogue text is sent to the backend API endpoint.

2. **Preprocessing**: The text is cleaned (whitespace normalization, removal of special characters if needed) to match the training data format.

3. **Tokenization**: The preprocessed text is prefixed with "summarize: " and converted into token IDs that the T5 model can understand.

4. **Model Inference**: The tokenized input is passed through the T5 model's encoder, which creates a contextual representation of the input. The decoder then generates a sequence of tokens representing the summary.

5. **Decoding**: The generated token sequence is converted back into human-readable text.

6. **Response**: The summary is returned to the user, capturing the key information: Hannah requested Betty's number, Amanda couldn't find it, and they agreed on an alternative solution.

The model uses beam search decoding (with 4 beams) to generate high-quality summaries, balancing between information retention and conciseness.

---

## 7. Technologies Used

This project utilizes the following technologies, frameworks, and libraries:

### 7.1 Backend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Python** | 3.8+ | Programming language for backend development |
| **FastAPI** | 0.104.1 | Modern, high-performance web framework for building REST APIs |
| **Uvicorn** | 0.24.0 | ASGI server for running FastAPI applications |
| **Pydantic** | 2.5.0 | Data validation using Python type annotations |
| **PyTorch** | 2.2.0+ | Deep learning framework for model inference |
| **HuggingFace Transformers** | 4.35.2 | Library for loading and using pre-trained transformer models |
| **SentencePiece** | 0.1.99+ | Tokenization library used by T5 models |

### 7.2 Frontend Technologies

| Technology | Purpose |
|------------|---------|
| **HTML5** | Markup language for structuring the web interface |
| **CSS3** | Styling and layout design (including gradients and responsive design) |
| **JavaScript (ES6+)** | Client-side scripting for API integration and dynamic content |

### 7.3 AI/ML Technologies

| Technology | Purpose |
|------------|---------|
| **T5 (Text-To-Text Transfer Transformer)** | Pre-trained transformer model fine-tuned for text summarization |
| **Transformer Architecture** | Neural network architecture based on self-attention mechanisms |
| **Beam Search Decoding** | Text generation algorithm for producing high-quality summaries |



## 8. Additional Information

### 8.1 Model Inference Details

- **Device**: CPU (can be configured for GPU if available)
- **Generation Method**: Beam search with 4 beams
- **Length Penalty**: 2.0 (encourages longer summaries)
- **Max Input Length**: 512 tokens
- **No Repeat N-gram Size**: 3 (prevents repetitive phrases)

### 8.2 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Serves the frontend HTML interface |
| `/summarize` | POST | Accepts text and returns generated summary |
| `/health` | GET | Returns server and model status |
| `/docs` | GET | Interactive API documentation (Swagger UI) |
| `/redoc` | GET | Alternative API documentation (ReDoc) |



