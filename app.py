# # Starts the API server and initializes the database

# from http.server import HTTPServer
# from router import StudentRouter
# from database.connection import init_database

# def run_server():
#     init_database()
#     server = HTTPServer(("", 8000), StudentRouter)
#     print("🚀 Server running at http://localhost:8000")
#     server.serve_forever()

# if __name__ == "__main__":
#     run_server()

# Starts the API server and initializes the database

from http.server import HTTPServer
from router import MainRouter
from database.init_db import init_db

def run_server():
    init_db()  # <-- this ensures tables always exist
    server = HTTPServer(("", 8000), MainRouter)
    print("🚀 Server running at http://localhost:8000")
    server.serve_forever()

if __name__ == "__main__":
    run_server()
