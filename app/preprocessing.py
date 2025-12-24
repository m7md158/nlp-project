"""
Text preprocessing utilities for dialogue summarization.
"""
import re


def preprocessing_text(text: str) -> str:
    """
    Preprocess dialogue text by removing file tags, URLs, emojis, and cleaning whitespace.
    
    Args:
        text: Input dialogue text
        
    Returns:
        Preprocessed text
    """
    # Remove file tags
    text = re.sub(r'<file_\w+>', '', text)
    text = re.sub(r'<[^>]+>', '', text)
    
    # Remove URLs
    text = re.sub(r'http\S+|www\.\S+', '', text)
    
    # Remove emojis
    emoji_pattern = re.compile(
        "["
        u"\U0001F600-\U0001F64F"
        u"\U0001F300-\U0001F5FF"
        u"\U0001F680-\U0001F6FF"
        u"\U0001F1E0-\U0001F1FF"
        u"\U00002702-\U000027B0"
        u"\U000024C2-\U0001F251"
        "]+",
        flags=re.UNICODE
    )
    text = emoji_pattern.sub(r'', text)
    
    # Clean whitespace
    text = re.sub(r'\s+', ' ', text)
    text = re.sub(r'\s+([.,!?;:])', r'\1', text)
    text = re.sub(r'([.,!?;:])\s*', r'\1 ', text)
    text = text.strip()
    
    return text

