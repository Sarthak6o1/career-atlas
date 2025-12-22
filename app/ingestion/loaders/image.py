from app.generation.llm import extract_text_from_image

def parse_image(contents: bytes, mime_type: str) -> str:
    """
    Parses resume text from an image file using Gemini Vision OCR.
    """
    return extract_text_from_image(contents, mime_type)
