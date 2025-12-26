# # Handlers are responsible for dealing with HTTP details (headers, body, methods)

# import json
# from core.responses import send_json, send_404
# from core.request import parse_json_body
# from services.student_service import (
#     service_get_all
#     , service_get_one
#     , service_create
#     , service_update
#     , service_delete
# )

# def get_all_students(handler):
#     return send_json(handler, 200, service_get_all())

# def get_student(handler, student_id):
#     student = service_get_one(student_id)
#     return send_json(handler, 200, student) if student else send_404(handler)

# def create_student(handler):
#     data = parse_json_body(handler)
#     new_student = service_create(data)
#     return send_json(handler, 201, new_student)

# def update_student(handler, student_id):
#     data = parse_json_body(handler)
#     updated = service_update(student_id, data)
#     return send_json(handler, 200, updated) if updated else send_404(handler)

# def delete_student(handler, student_id):
#     deleted = service_delete(student_id)
#     return send_json(handler, 200, {"deleted": True}) if deleted else send_404(handler)

# Handlers are responsible for dealing with HTTP details (headers, body, methods)

import json
from core.responses import send_json, send_404
from core.request import parse_json_body
from services.student_service import (
    service_get_all,
    service_get_one,
    service_create,
    service_update,
    service_delete
)


def get_all_students(handler):
    return send_json(handler, 200, service_get_all())


def get_student(handler, student_id):
    student = service_get_one(student_id)
    return send_json(handler, 200, student) if student else send_404(handler)


def create_student(handler):
    try:
        data = parse_json_body(handler)

        # Basic validation (optional but prevents bad insert)
        required_fields = ["name", "email", "course", "year"]
        if not data or not all(field in data for field in required_fields):
            return send_json(handler, 400, {
                "error": "Missing or invalid fields",
                "required_fields": required_fields
            })

        new_student = service_create(data)
        return send_json(handler, 201, new_student)

    except Exception as e:
        # Ensures server always returns a response
        return send_json(handler, 500, {"error": str(e)})


def update_student(handler, student_id):
    try:
        data = parse_json_body(handler)
        updated = service_update(student_id, data)
        return send_json(handler, 200, updated) if updated else send_404(handler)
    except Exception as e:
        return send_json(handler, 500, {"error": str(e)})


def delete_student(handler, student_id):
    try:
        deleted = service_delete(student_id)
        return send_json(handler, 200, {"deleted": True}) if deleted else send_404(handler)
    except Exception as e:
        return send_json(handler, 500, {"error": str(e)})
