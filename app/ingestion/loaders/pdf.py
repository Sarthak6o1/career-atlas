from pdfminer.high_level import extract_text
import io

def parse_pdf(file_bytes: bytes) -> str:
    try:
        file_stream = io.BytesIO(file_bytes)
        text = extract_text(file_stream)
        return text
    except Exception as e:
        print(f"Error parsing PDF: {e}")
        return ""
