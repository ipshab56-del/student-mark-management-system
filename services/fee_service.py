from database.connection import get_connection

class FeeService:
    @staticmethod
    def get_all():
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM fees")
        fees = cursor.fetchall()
        conn.close()
        return fees

    @staticmethod
    def get_by_id(fee_id):
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM fees WHERE id = ?", (fee_id,))
        fee = cursor.fetchone()
        conn.close()
        return fee

    @staticmethod
    def create(data):
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO fees (student_id, amount, due_date, status, description) VALUES (?, ?, ?, ?, ?)",
            (data['student_id'], data['amount'], data['due_date'], data.get('status', 'pending'), data.get('description', ''))
        )
        fee_id = cursor.lastrowid
        conn.commit()
        conn.close()
        return fee_id

    @staticmethod
    def update(fee_id, data):
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE fees SET student_id = ?, amount = ?, due_date = ?, status = ?, description = ? WHERE id = ?",
            (data['student_id'], data['amount'], data['due_date'], data.get('status', 'pending'), data.get('description', ''), fee_id)
        )
        success = cursor.rowcount > 0
        conn.commit()
        conn.close()
        return success

    @staticmethod
    def delete(fee_id):
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM fees WHERE id = ?", (fee_id,))
        success = cursor.rowcount > 0
        conn.commit()
        conn.close()
        return success