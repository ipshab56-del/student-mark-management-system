# Starts the API server and initializes the database
from http.server import HTTPServer
from router import MainRouter
from database.init_db import init_db


def run_server():
    # Ensure database and tables exist before starting server
    init_db()

    server_address = ("", 8000)
    httpd = HTTPServer(server_address, MainRouter)
    
    # Fix 504 Gateway Timeout: Set timeout for connections
    # This prevents hanging connections that cause 504 errors
    httpd.timeout = 10  # 10 second timeout for all connections
    
    print("Server running at http://localhost:8000")
    print(f"Connection timeout set to {httpd.timeout} seconds")

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped by user")
    finally:
        httpd.server_close()
        print("Server closed cleanly")


if __name__ == "__main__":
    run_server()

