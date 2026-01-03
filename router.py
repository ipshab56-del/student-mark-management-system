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

from core.static import serve_static
from core.responses import send_404
from core.middleware import add_cors_headers


# -------------------------------
# UI ROUTES
# -------------------------------
FRONTEND_ROUTES = {"/", "/home", "/students", "/teachers", "/marks", "/docs"}

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

    if path == "/openapi.yaml":
        serve_static(handler, "openapi.yaml")
        return True

    return False


# -------------------------------
# STUDENT ROUTER
# -------------------------------
class StudentRouter(BaseHTTPRequestHandler):

    def do_OPTIONS(self):
        self.send_response(200)
        add_cors_headers(self)
        self.end_headers()

    def do_GET(self):
        path = urlparse(self.path).path

        if handle_ui_routes(self, path):
            return

        if path == "/api/students":
            return get_all_students(self)

        if path.startswith("/api/students/"):
            student_id = path.split("/")[-1]
            if student_id.isdigit():
                return get_student(self, int(student_id))

        return send_404(self)

    def do_POST(self):
        if self.path == "/api/students":
            return create_student(self)
        return send_404(self)

    def do_PUT(self):
        path = self.path
        if path.startswith("/api/students/"):
            student_id = path.split("/")[-1]
            if student_id.isdigit():
                return update_student(self, int(student_id))
        return send_404(self)

    def do_DELETE(self):
        path = self.path
        if path.startswith("/api/students/"):
            student_id = path.split("/")[-1]
            if student_id.isdigit():
                return delete_student(self, int(student_id))
        return send_404(self)

    def log_message(self, format, *args):
        print(f"[{datetime.now():%Y-%m-%d %H:%M:%S}] [StudentRouter] {format % args}")


# -------------------------------
# TEACHER ROUTER
# -------------------------------
class TeacherRouter(BaseHTTPRequestHandler):

    def do_OPTIONS(self):
        self.send_response(200)
        add_cors_headers(self)
        self.end_headers()

    def do_GET(self):
        path = urlparse(self.path).path

        if handle_ui_routes(self, path):
            return

        if path == "/api/teachers":
            return get_all_teachers(self)

        if path.startswith("/api/teachers/"):
            teacher_id = path.split("/")[-1]
            if teacher_id.isdigit():
                return get_teacher(self, int(teacher_id))

        if path == "/api/marks":
            return get_all_marks(self)

        if path.startswith("/api/marks/"):
            mark_id = path.split("/")[-1]
            if mark_id.isdigit():
                return get_mark(self, int(mark_id))

        return send_404(self)

    def do_POST(self):
        if self.path == "/api/teachers":
            return create_teacher(self)
        if self.path == "/api/marks":
            return create_mark(self)
        return send_404(self)

    def do_PUT(self):
        path = self.path
        if path.startswith("/api/teachers/"):
            teacher_id = path.split("/")[-1]
            if teacher_id.isdigit():
                return update_teacher(self, int(teacher_id))
        if path.startswith("/api/marks/"):
            mark_id = path.split("/")[-1]
            if mark_id.isdigit():
                return update_mark(self, int(mark_id))
        return send_404(self)

    def do_DELETE(self):
        path = self.path
        if path.startswith("/api/teachers/"):
            teacher_id = path.split("/")[-1]
            if teacher_id.isdigit():
                return delete_teacher(self, int(teacher_id))
        if path.startswith("/api/marks/"):
            mark_id = path.split("/")[-1]
            if mark_id.isdigit():
                return delete_mark(self, int(mark_id))
        return send_404(self)

    def log_message(self, format, *args):
        print(f"[{datetime.now():%Y-%m-%d %H:%M:%S}] [TeacherRouter] {format % args}")


# -------------------------------
# MAIN ROUTER (DELEGATES REQUESTS)
# -------------------------------
class MainRouter(BaseHTTPRequestHandler):
    """
    Delegates the current request to the correct router.
    We DO NOT instantiate routers — we call their methods on self.
    """

    def dispatch(self, method_name):
        path = self.path

        # marks API routes
        if path.startswith("/api/marks"):
            return getattr(TeacherRouter, method_name)(self)

        # teacher API routes
        if path.startswith("/api/teachers"):
            return getattr(TeacherRouter, method_name)(self)

        # student API + UI routes
        return getattr(StudentRouter, method_name)(self)

    def do_GET(self):
        return self.dispatch("do_GET")

    def do_POST(self):
        return self.dispatch("do_POST")

    def do_PUT(self):
        return self.dispatch("do_PUT")

    def do_DELETE(self):
        return self.dispatch("do_DELETE")

    def do_OPTIONS(self):
        return self.dispatch("do_OPTIONS")
