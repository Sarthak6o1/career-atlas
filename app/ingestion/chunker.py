import re

def chunk_text(text: str, chunk_size: int = 1000, overlap: int = 100) -> list[str]:
    if not text:
        return []

    text = text.replace('\r\n', '\n').replace('\r', '\n')
    
    paragraphs = re.split(r'\n\s*\n', text)
    
    final_chunks = []
    current_chunk = []
    current_length = 0
    
    for para in paragraphs:
        para = para.strip()
        if not para:
            continue
            
        if len(para) + current_length <= chunk_size:
            current_chunk.append(para)
            current_length += len(para) + 1
        else:
            if current_chunk:
                joined = "\n\n".join(current_chunk)
                final_chunks.append(joined)
                
                overlap_text = current_chunk[-1]
                current_chunk = [overlap_text] if len(overlap_text) < chunk_size else []
                current_length = len("\n\n".join(current_chunk))
            
            if len(para) > chunk_size:
                sub_chunks = _split_large_text(para, chunk_size, overlap)
                final_chunks.extend(sub_chunks)
                current_chunk = []
                current_length = 0
            else:
                current_chunk = [para]
                current_length = len(para)

    if current_chunk:
        final_chunks.append("\n\n".join(current_chunk))
        
    return final_chunks

def _split_large_text(text: str, limit: int, overlap: int) -> list[str]:
    sentences = re.split(r'(?<=[.!?])\s+', text)
    
    chunks = []
    curr = ""
    
    for sent in sentences:
        if len(curr) + len(sent) <= limit:
            curr += sent + " "
        else:
            chunks.append(curr.strip())
            curr = sent + " " 
            
    if curr:
        chunks.append(curr.strip())
        
    final_chunks = []
    for c in chunks:
        if len(c) > limit:
            words = c.split(' ')
            w_curr = ""
            for w in words:
                if len(w_curr) + len(w) <= limit:
                    w_curr += w + " "
                else:
                    final_chunks.append(w_curr.strip())
                    w_curr = w + " "
            if w_curr:
                final_chunks.append(w_curr.strip())
        else:
            final_chunks.append(c)
            
    return final_chunks
