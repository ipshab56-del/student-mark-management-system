from datetime import datetime
from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse

# -------------------------------
# IMPORTS
# -------------------------------
from controllers.students import (
    get_all_students,
    get_student,
    create_student,
    update_student,
    delete_student,
)

from controllers.teachers import (
    get_all_teachers,
    get_teacher,
    create_teacher,
    update_teacher,
    delete_teacher,
)

from controllers.marks import (
    get_all_marks,
    get_mark,
    create_mark,
    update_mark,
    delete_mark,
)

from controllers.fees import (
    get_all_fees,
    get_fee,
    create_fee,
    update_fee,
    delete_fee,
)

from core.static import serve_static
from core.responses import send_404
from core.middleware import add_cors_headers


# -------------------------------
# UI ROUTES
# -------------------------------
FRONTEND_ROUTES = {"/", "/home", "/students", "/teachers", "/marks", "/fees", "/reports", "/profile", "/docs"}

def handle_ui_routes(handler, path):
    """Serve SPA frontend pages and static files."""
    if path in FRONTEND_ROUTES:
        serve_static(handler, "frontend/pages/index.html")
        return True

    if path.endswith(".html"):
        stripped = path.replace(".html", "")
        if stripped in FRONTEND_ROUTES:
            serve_static(handler, "frontend/pages/index.html")
            return True

    if path.startswith("/frontend/"):
        serve_static(handler, path.lstrip("/"))
        return True

    if path == "/favicon.ico":
        serve_static(handler, "frontend/assets/favicon.ico")
        return True

    if path == "/image.png":
        serve_static(handler, "image.png")
        return True

    if path == "/back.png":
        serve_static(handler, "back.png")
        return True

    if path == "/openapi.yaml":
        serve_static(handler, "openapi.yaml")
        return True

    return False


# The MainRouter class below handles all routing



# -------------------------------
# MAIN ROUTER (DELEGATES REQUESTS)
# -------------------------------
class MainRouter(BaseHTTPRequestHandler):
    """
    Delegates the current request to the correct router.
    Routes logic directly without trying to call other router classes.
    """

    # Reduce timeout for faster failure detection, preventing 504 accumulation
    timeout = 10  # 10 second timeout - faster than 30s default

    def do_OPTIONS(self):
        self.send_response(200)
        add_cors_headers(self)
        self.end_headers()

    def do_HEAD(self):
        """
        Handle HEAD requests the same as GET (for proxy/load balancer health checks).
        This prevents 504 errors from proxies that check resource availability.
        """
        return self.do_GET()

    def do_GET(self):
        path = urlparse(self.path).path

        # UI and static file routes
        if handle_ui_routes(self, path):
            return

        # Student API routes
        if path == "/api/students":
            return get_all_students(self)
        if path.startswith("/api/students/"):
            student_id = path.split("/")[-1]
            if student_id.isdigit():
                return get_student(self, int(student_id))

        # Teacher API routes
        if path == "/api/teachers":
            return get_all_teachers(self)
        if path.startswith("/api/teachers/"):
            teacher_id = path.split("/")[-1]
            if teacher_id.isdigit():
                return get_teacher(self, int(teacher_id))

        # Mark API routes
        if path == "/api/marks":
            return get_all_marks(self)
        if path.startswith("/api/marks/"):
            mark_id = path.split("/")[-1]
            if mark_id.isdigit():
                return get_mark(self, int(mark_id))

        # Fee API routes
        if path == "/api/fees":
            return get_all_fees(self)
        if path.startswith("/api/fees/"):
            fee_id = path.split("/")[-1]
            if fee_id.isdigit():
                return get_fee(self, int(fee_id))

        return send_404(self)

    def do_POST(self):
        path = urlparse(self.path).path

        if path == "/api/students":
            return create_student(self)
        if path == "/api/teachers":
            return create_teacher(self)
        if path == "/api/marks":
            return create_mark(self)
        if path == "/api/fees":
            return create_fee(self)

        return send_404(self)

    def do_PUT(self):
        path = urlparse(self.path).path

        if path.startswith("/api/students/"):
            student_id = path.split("/")[-1]
            if student_id.isdigit():
                return update_student(self, int(student_id))
        if path.startswith("/api/teachers/"):
            teacher_id = path.split("/")[-1]
            if teacher_id.isdigit():
                return update_teacher(self, int(teacher_id))
        if path.startswith("/api/marks/"):
            mark_id = path.split("/")[-1]
            if mark_id.isdigit():
                return update_mark(self, int(mark_id))
        if path.startswith("/api/fees/"):
            fee_id = path.split("/")[-1]
            if fee_id.isdigit():
                return update_fee(self, int(fee_id))

        return send_404(self)

    def do_DELETE(self):
        path = urlparse(self.path).path

        if path.startswith("/api/students/"):
            student_id = path.split("/")[-1]
            if student_id.isdigit():
                return delete_student(self, int(student_id))
        if path.startswith("/api/teachers/"):
            teacher_id = path.split("/")[-1]
            if teacher_id.isdigit():
                return delete_teacher(self, int(teacher_id))
        if path.startswith("/api/marks/"):
            mark_id = path.split("/")[-1]
            if mark_id.isdigit():
                return delete_mark(self, int(mark_id))
        if path.startswith("/api/fees/"):
            fee_id = path.split("/")[-1]
            if fee_id.isdigit():
                return delete_fee(self, int(fee_id))

        return send_404(self)

    def log_message(self, format, *args):
        print(f"[{datetime.now():%Y-%m-%d %H:%M:%S}] [MainRouter] {format % args}")

