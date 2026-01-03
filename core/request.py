# Handles incoming HTTP request data (reads JSON from the client)

import json

def parse_json_body(handler):
    """Read and decode JSON from HTTP request body."""
    try:
        length = int(handler.headers.get("Content-Length", 0))
        if length == 0:
            return {}
        raw = handler.rfile.read(length)
        return json.loads(raw.decode("utf-8"))
    except (ValueError, json.JSONDecodeError) as e:
        raise ValueError(f"Invalid JSON: {e}")