import json
from core.responses import send_json, send_404
from core.request import parse_json_body
from services.mark_service import (
    service_get_all,
    service_get_one,
    service_create,
    service_update,
    service_delete,
)

def get_all_marks(handler):
    return send_json(handler, 200, service_get_all())

def get_mark(handler, mark_id):
    mark = service_get_one(mark_id)
    return send_json(handler, 200, mark) if mark else send_404(handler)

def create_mark(handler):
    try:
        data = parse_json_body(handler)
        new_mark = service_create(data)
        return send_json(handler, 201, new_mark)
    except ValueError as e:
        return send_json(handler, 400, {"error": str(e)})
    except Exception as e:
        return send_json(handler, 500, {"error": str(e)})

def update_mark(handler, mark_id):
    try:
        data = parse_json_body(handler)
        updated = service_update(mark_id, data)
        return send_json(handler, 200, updated) if updated else send_404(handler)
    except Exception as e:
        return send_json(handler, 500, {"error": str(e)})

def delete_mark(handler, mark_id):
    try:
        deleted = service_delete(mark_id)
        return send_json(handler, 200, {"deleted": True}) if deleted else send_404(handler)
    except Exception as e:
        return send_json(handler, 500, {"error": str(e)})