from database.connection import get_connection

def clear_all_data():
    conn = get_connection()
    try:
        # Delete all records from tables in order to avoid foreign key constraints
        conn.execute("DELETE FROM fees")
        conn.execute("DELETE FROM marks")
        conn.execute("DELETE FROM teachers")
        conn.execute("DELETE FROM students")
        conn.commit()
        print("All data has been removed from the database.")
    except Exception as e:
        print(f"Error clearing data: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    clear_all_data()
