# Contains business logic for TEACHERS

from database.queries import (
    teacher_get_all,
    teacher_get_one,
    teacher_create,
    teacher_update,
    teacher_delete,
)

REQUIRED_FIELDS = ["name", "email", "subject", "department"]

def validate_teacher_data(data):
    if not isinstance(data, dict):
        raise ValueError("Invalid data format. Expected JSON object.")
    missing = [field for field in REQUIRED_FIELDS if field not in data]
    if missing:
        raise ValueError(f"Missing required fields: {', '.join(missing)}")
    return data


def service_get_all():
    return teacher_get_all()


def service_get_one(teacher_id):
    return teacher_get_one(teacher_id)


def service_create(data):
    valid_data = validate_teacher_data(data)
    return teacher_create(valid_data)


def service_update(teacher_id, data):
    if not data:
        raise ValueError("No data provided for update.")
    valid_data = {k: v for k, v in data.items() if k in REQUIRED_FIELDS}
    if not valid_data:
        raise ValueError("No valid teacher fields to update.")
    return teacher_update(teacher_id, valid_data)


def service_delete(teacher_id):
    return teacher_delete(teacher_id)
