from database.queries import (
    mark_get_all,
    mark_get_one,
    mark_create,
    mark_update,
    mark_delete
)

REQUIRED_FIELDS = ["student_id", "subject", "marks"]

def validate_mark_data(data):
    if not isinstance(data, dict):
        raise ValueError("Invalid data format. Expected JSON object.")

    missing = [field for field in REQUIRED_FIELDS if field not in data]
    if missing:
        raise ValueError(f"Missing required fields: {', '.join(missing)}")

    return data

def service_get_all():
    return mark_get_all()

def service_get_one(mark_id):
    return mark_get_one(mark_id)

def service_create(data):
    valid_data = validate_mark_data(data)
    return mark_create(valid_data)

def service_update(mark_id, data):
    if not data:
        raise ValueError("No data received for update.")

    clean_data = {k: v for k, v in data.items() if k in REQUIRED_FIELDS}

    if not clean_data:
        raise ValueError("No valid mark fields to update.")

    return mark_update(mark_id, clean_data)

def service_delete(mark_id):
    return mark_delete(mark_id)