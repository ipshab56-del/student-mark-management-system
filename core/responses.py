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
        pass  # Client disconnected, ignore

def send_404(handler):
    try:
        handler.send_response(404)
        add_cors_headers(handler)
        handler.send_header("Content-Type", "text/html")
        handler.end_headers()
        handler.wfile.write(b"<h1>404 Not Found</h1>")
    except (BrokenPipeError, ConnectionResetError):
        pass  # Client disconnected, ignore