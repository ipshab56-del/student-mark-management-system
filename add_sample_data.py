from database.connection import get_connection
from database.queries import student_create, teacher_create, mark_create, fee_get_all
from datetime import datetime, timedelta
import random

def add_sample_data():
    conn = get_connection()
    try:
        # Add 10 sample students
        students = []
        courses = ["Computer Science", "Mathematics", "Physics", "Chemistry", "Biology"]
        for i in range(1, 11):
            student_data = {
                "name": f"Student {i}",
                "email": f"student{i}@example.com",
                "course": random.choice(courses),
                "year": random.randint(1, 4)
            }
            student = student_create(student_data)
            students.append(student)

        # Add 10 sample teachers
        subjects = ["Mathematics", "Physics", "Chemistry", "Biology", "Computer Science", "English", "History", "Geography", "Art", "Music"]
        for i in range(1, 11):
            teacher_data = {
                "name": f"Teacher {i}",
                "email": f"teacher{i}@example.com",
                "subject": random.choice(subjects)
            }
            teacher_create(teacher_data)

        # Add 10 sample marks (one per student)
        subjects_marks = ["Math", "Science", "English", "History", "Geography"]
        for student in students:
            mark_data = {
                "student_id": student["id"],
                "subject": random.choice(subjects_marks),
                "marks": random.randint(50, 100)
            }
            mark_create(mark_data)

        # Add 10 sample fees (one per student)
        for student in students:
            due_date = (datetime.utcnow() + timedelta(days=random.randint(1, 365))).date().isoformat()
            fee_data = {
                "student_id": student["id"],
                "amount": round(random.uniform(100, 1000), 2),
                "due_date": due_date,
                "status": random.choice(["pending", "paid"]),
                "description": f"Tuition fee for {student['course']}"
            }
            # Since fee_create is not in queries.py, I'll insert directly
            now = datetime.utcnow().isoformat()
            conn.execute("""
                INSERT INTO fees (student_id, amount, due_date, status, description, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (
                fee_data["student_id"],
                fee_data["amount"],
                fee_data["due_date"],
                fee_data["status"],
                fee_data["description"],
                now,
                now
            ))

        conn.commit()
        print("10 sample data added to each table.")
    except Exception as e:
        print(f"Error adding sample data: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    add_sample_data()
