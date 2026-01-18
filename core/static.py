# core/static.py
import os
import mimetypes
from core.responses import send_404

# Fix MIME types for ES modules and other common types
mimetypes.add_type("application/javascript", ".js")
mimetypes.add_type("text/css", ".css")
mimetypes.add_type("text/html", ".html")
mimetypes.add_type("image/png", ".png")
mimetypes.add_type("image/jpeg", ".jpg")
mimetypes.add_type("image/jpeg", ".jpeg")

def serve_static(handler, filepath):
    # Normalize path
    full_path = os.path.join(".", filepath)

    # File doesn't exist
    if not os.path.exists(full_path):
        print("STATIC ERROR: File not found:", full_path)
        return send_404(handler)

    try:
        # Read file in binary mode
        with open(full_path, "rb") as f:
            content = f.read()

        content_type, _ = mimetypes.guess_type(full_path)

        # Force-correct content types for all common file types
        if full_path.endswith(".html"):
            content_type = "text/html"
        elif full_path.endswith(".yaml") or full_path.endswith(".yml"):
            content_type = "text/yaml"
        elif full_path.endswith(".js"):
            content_type = "application/javascript"
        elif full_path.endswith(".css"):
            content_type = "text/css"

        handler.send_response(200)
        handler.send_header("Content-Type", content_type or "application/octet-stream")
        handler.send_header("Content-Length", len(content))
        handler.send_header("Cache-Control", "public, max-age=3600")
        handler.end_headers()

        # Write content in chunks to avoid memory issues
        chunk_size = 8192
        for i in range(0, len(content), chunk_size):
            chunk = content[i:i + chunk_size]
            handler.wfile.write(chunk)

    except (BrokenPipeError, ConnectionResetError):
        # Client disconnected - log and return without error response
        # as the connection is already closed
        print(f"Client disconnected during file transfer: {filepath}")
        try:
            handler.send_error(499, "Client Closed Request")
        except Exception:
            pass
    except Exception as e:
        print("STATIC ERROR:", e)
        try:
            return send_404(handler)
        except Exception:
            pass
