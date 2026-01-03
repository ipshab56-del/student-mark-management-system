# Contains business logic (validation, processing, rules)
# Does NOT know about HTTP — only works with Python data

from database.queries import (
    teacher_get_all,
    teacher_get_one,
    teacher_create,
    teacher_update,
    teacher_delete
)

# required fields for teacher creation
REQUIRED_FIELDS = ["name", "email", "subject"]


def validate_teacher_data(data):
    """Ensure data contains required fields."""
    if not isinstance(data, dict):
        raise ValueError("Invalid data format. Expected JSON object.")

    missing = [field for field in REQUIRED_FIELDS if field not in data]
    if missing:
        raise ValueError(f"Missing required fields: {', '.join(missing)}")

    return data


# -------------------------
# READ
# -------------------------

def service_get_all():
    return teacher_get_all()


def service_get_one(teacher_id):
    return teacher_get_one(teacher_id)


# -------------------------
# CREATE
# -------------------------

def service_create(data):
    valid_data = validate_teacher_data(data)
    return teacher_create(valid_data)


# -------------------------
# UPDATE
# -------------------------

def service_update(teacher_id, data):
    """Partial update allowed, but at least one valid field must be present."""
    if not data:
        raise ValueError("No data received for update.")

    clean_data = {k: v for k, v in data.items() if k in REQUIRED_FIELDS}

    if not clean_data:
        raise ValueError("No valid teacher fields to update.")

    return teacher_update(teacher_id, clean_data)


# -------------------------
# DELETE
# -------------------------

def service_delete(teacher_id):
    return teacher_delete(teacher_id)
