from database.connection import get_connection
from datetime import datetime


# -------------------------
# STUDENTS
# -------------------------

def student_get_all():
    conn = get_connection()
    rows = conn.execute("SELECT * FROM students").fetchall()
    conn.close()
    return [dict(row) for row in rows]


def student_get_one(student_id):
    conn = get_connection()
    row = conn.execute(
        "SELECT * FROM students WHERE id = ?",
        (student_id,)
    ).fetchone()
    conn.close()
    return dict(row) if row else None


def student_create(data):
    conn = get_connection()
    try:
        now = datetime.utcnow().isoformat()
        cursor = conn.execute("""
            INSERT INTO students (name, email, course, year, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (
            data["name"],
            data["email"],
            data["course"],
            int(data["year"]),
            now,
            now
        ))
        conn.commit()
        student_id = cursor.lastrowid
        return student_get_one(student_id)
    finally:
        conn.close()


def student_update(student_id, data):
    conn = get_connection()
    fields = ", ".join(f"{k}=?" for k in data.keys())
    values = list(data.values())
    values.append(student_id)

    conn.execute(
        f"UPDATE students SET {fields}, updated_at=? WHERE id=?",
        (*values[:-1], datetime.utcnow().isoformat(), values[-1])
    )

    conn.commit()
    conn.close()
    return student_get_one(student_id)


def student_delete(student_id):
    conn = get_connection()
    cur = conn.execute(
        "DELETE FROM students WHERE id=?",
        (student_id,)
    )
    conn.commit()
    conn.close()
    return cur.rowcount > 0


# -------------------------
# TEACHERS
# -------------------------

def teacher_get_all():
    conn = get_connection()
    rows = conn.execute("SELECT * FROM teachers").fetchall()
    conn.close()
    return [dict(row) for row in rows]


def teacher_get_one(teacher_id):
    conn = get_connection()
    row = conn.execute(
        "SELECT * FROM teachers WHERE id = ?",
        (teacher_id,)
    ).fetchone()
    conn.close()
    return dict(row) if row else None


def teacher_create(data):
    conn = get_connection()
    try:
        now = datetime.utcnow().isoformat()
        cursor = conn.execute("""
            INSERT INTO teachers (name, email, subject, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?)
        """, (
            data["name"],
            data["email"],
            data["subject"],
            now,
            now
        ))
        conn.commit()
        teacher_id = cursor.lastrowid
        return teacher_get_one(teacher_id)
    finally:
        conn.close()


def teacher_update(teacher_id, data):
    conn = get_connection()
    fields = ", ".join(f"{k}=?" for k in data.keys())
    values = list(data.values())
    values.append(teacher_id)

    conn.execute(
        f"UPDATE teachers SET {fields}, updated_at=? WHERE id=?",
        (*values[:-1], datetime.utcnow().isoformat(), values[-1])
    )

    conn.commit()
    conn.close()
    return teacher_get_one(teacher_id)


def teacher_delete(teacher_id):
    conn = get_connection()
    cur = conn.execute(
        "DELETE FROM teachers WHERE id=?",
        (teacher_id,)
    )
    conn.commit()
    conn.close()
    return cur.rowcount > 0


# -------------------------
# MARKS
# -------------------------

def mark_get_all():
    conn = get_connection()
    rows = conn.execute("""
        SELECT m.*, s.name as student_name 
        FROM marks m 
        JOIN students s ON m.student_id = s.id
    """).fetchall()
    conn.close()
    return [dict(row) for row in rows]


def mark_get_one(mark_id):
    conn = get_connection()
    row = conn.execute(
        "SELECT * FROM marks WHERE id = ?",
        (mark_id,)
    ).fetchone()
    conn.close()
    return dict(row) if row else None


def mark_create(data):
    conn = get_connection()
    try:
        now = datetime.utcnow().isoformat()
        cursor = conn.execute("""
            INSERT INTO marks (student_id, subject, marks, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?)
        """, (
            int(data["student_id"]),
            data["subject"],
            int(data["marks"]),
            now,
            now
        ))
        conn.commit()
        mark_id = cursor.lastrowid
        return mark_get_one(mark_id)
    finally:
        conn.close()


def mark_update(mark_id, data):
    conn = get_connection()
    fields = ", ".join(f"{k}=?" for k in data.keys())
    values = list(data.values())
    values.append(mark_id)

    conn.execute(
        f"UPDATE marks SET {fields}, updated_at=? WHERE id=?",
        (*values[:-1], datetime.utcnow().isoformat(), values[-1])
    )

    conn.commit()
    conn.close()
    return mark_get_one(mark_id)


def mark_delete(mark_id):
    conn = get_connection()
    cur = conn.execute(
        "DELETE FROM marks WHERE id=?",
        (mark_id,)
    )
    conn.commit()
    conn.close()
    return cur.rowcount > 0
