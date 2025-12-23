# Actual SQL queries — Create, Read, Update, Delete (CRUD)

from datetime import datetime
from .connection import get_connection

def db_get_all():
    conn = get_connection()
    rows = conn.execute("SELECT * FROM students ORDER BY id DESC").fetchall()
    conn.close()
    return [dict(r) for r in rows]

def db_get_one(student_id):
    conn = get_connection()
    row = conn.execute("SELECT * FROM students WHERE id = ?", (student_id,)).fetchone()
    conn.close()
    return dict(row) if row else None

def db_create(data):
    conn = get_connection()
    now = datetime.now().isoformat()
    cur = conn.execute(
        "INSERT INTO students (name, email, course, year, created_at) VALUES (?, ?, ?, ?, ?)",
        (data["name"], data["email"], data["course"], data["year"], now)
    )
    conn.commit()
    new_id = cur.lastrowid
    conn.close()
    return db_get_one(new_id)

def db_update(student_id, data):
    conn = get_connection()
    now = datetime.now().isoformat()
    conn.execute("""
        UPDATE students SET name=?, email=?, course=?, year=?, updated_at=?
        WHERE id=?
    """, (data["name"], data["email"], data["course"], data["year"], now, student_id))
    conn.commit()
    conn.close()
    return db_get_one(student_id)

def db_delete(student_id):
    student = db_get_one(student_id)
    if not student:
        return None

    conn = get_connection()
    conn.execute("DELETE FROM students WHERE id=?", (student_id,))
    conn.commit()
    conn.close()
    return student

# # Actual SQL queries — Create, Read, Update, Delete (CRUD)

# from datetime import datetime
# from .teacher_db import get_connection

def db_get_all():
    conn = get_connection()
    rows = conn.execute("SELECT * FROM teachers ORDER BY id DESC").fetchall()
    conn.close()
    return [dict(r) for r in rows]

def db_get_one(teacher_id):
    conn = get_connection()
    row = conn.execute("SELECT * FROM teachers WHERE id = ?", (teacher_id,)).fetchone()
    conn.close()
    return dict(row) if row else None

def db_create(data):
    conn = get_connection()
    now = datetime.now().isoformat()
    cur = conn.execute(
        """
        INSERT INTO teachers (name, email, subject, department, created_at)
        VALUES (?, ?, ?, ?, ?)
        """,
        (data["name"], data["email"], data["subject"], data["department"], now)
    )
    conn.commit()
    new_id = cur.lastrowid
    conn.close()
    return db_get_one(new_id)

def db_update(teacher_id, data):
    conn = get_connection()
    now = datetime.now().isoformat()
    conn.execute(
        """
        UPDATE teachers
        SET name=?, email=?, subject=?, department=?, updated_at=?
        WHERE id=?
        """,
        (data["name"], data["email"], data["subject"], data["department"], now, teacher_id)
    )
    conn.commit()
    conn.close()
    return db_get_one(teacher_id)

def db_delete(teacher_id):
    teacher = db_get_one(teacher_id)
    if not teacher:
        return None

    conn = get_connection()
    conn.execute("DELETE FROM teachers WHERE id=?", (teacher_id,))
    conn.commit()
    conn.close()
    return teacher
