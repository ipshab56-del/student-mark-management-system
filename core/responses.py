# Sends HTTP responses back to the client (JSON or HTML)

import json
from core.middleware import add_cors_headers

def send_json(handler, status, data):
    try:
        handler.send_response(status)
        add_cors_headers(handler)
        handler.send_header("Content-Type", "application/json")
        handler.end_headers()
        handler.wfile.write(json.dumps(data).encode("utf-8"))
    except (BrokenPipeError, ConnectionResetError):
        # Client disconnected - connection already closed, nothing to do
        print(f"Client disconnected during JSON response: {handler.path if hasattr(handler, 'path') else 'unknown'}")
    except Exception as e:
        print(f"Error sending JSON response: {e}")
        try:
            handler.send_error(500, "Internal Server Error")
        except Exception:
            pass

def send_404(handler):
    try:
        handler.send_response(404)
        add_cors_headers(handler)
        handler.send_header("Content-Type", "text/html")
        handler.end_headers()
        handler.wfile.write(b"<h1>404 Not Found</h1>")
    except (BrokenPipeError, ConnectionResetError):
        # Client disconnected - connection already closed, nothing to do
        print(f"Client disconnected during 404 response")
    except Exception as e:
        print(f"Error sending 404 response: {e}")
        try:
            handler.send_error(500, "Internal Server Error")
        except Exception:
            pass
