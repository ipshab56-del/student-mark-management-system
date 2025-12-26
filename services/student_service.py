# # Contains business logic (validation, processing, rules)
# # Does NOT know about HTTP — only works with Python data

# from database.queries import (
#     db_get_all
#     , db_get_one
#     , db_create
#     , db_update
#     , db_delete
# )

# def service_get_all():
#     return db_get_all()

# def service_get_one(student_id):
#     return db_get_one(student_id)

# def service_create(data):
#     return db_create(data)

# def service_update(student_id, data):
#     return db_update(student_id, data)

# def service_delete(student_id):
#     return db_delete(student_id)

# Contains business logic (validation, processing, rules)
# Does NOT know about HTTP — only works with Python data

from database.queries import (
    student_get_all,
    student_get_one,
    student_create,
    student_update,
    student_delete
)

# required fields for student creation
REQUIRED_FIELDS = ["name", "email", "course", "year"]


def validate_student_data(data):
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
    return student_get_all()


def service_get_one(student_id):
    return student_get_one(student_id)


# -------------------------
# CREATE
# -------------------------

def service_create(data):
    valid_data = validate_student_data(data)
    return student_create(valid_data)


# -------------------------
# UPDATE
# -------------------------

def service_update(student_id, data):
    """Partial update allowed, but at least one valid field must be present."""
    if not data:
        raise ValueError("No data received for update.")

    clean_data = {k: v for k, v in data.items() if k in REQUIRED_FIELDS}

    if not clean_data:
        raise ValueError("No valid student fields to update.")

    return student_update(student_id, clean_data)


# -------------------------
# DELETE
# -------------------------

def service_delete(student_id):
    return student_delete(student_id)
