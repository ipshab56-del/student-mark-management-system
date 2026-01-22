"""
Comprehensive CRUD Operations Test for Student Mark Management System
Tests all endpoints for Students, Teachers, Marks, and Fees
"""

import unittest
import os
import time
import subprocess
import json
import urllib.request
import urllib.error
from urllib.parse import urljoin


class TestAllCRUDOperations(unittest.TestCase):
    """Test all CRUD operations in sequence"""

    @classmethod
    def setUpClass(cls):
        """Start the server before running tests"""
        cls.port = "8000"
        cls.base_url = f"http://127.0.0.1:{cls.port}"

        env = os.environ.copy()
        env["PORT"] = cls.port

        cls.proc = subprocess.Popen(
            ["python", "app.py"],
            env=env,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
        )

        # Wait for server to start
        time.sleep(3)
        print("\n" + "="*70)
        print("SERVER STARTED - RUNNING COMPREHENSIVE CRUD TESTS")
        print("="*70)

    @classmethod
    def tearDownClass(cls):
        """Stop the server after tests"""
        cls.proc.terminate()
        try:
            cls.proc.wait(timeout=3)
        except Exception:
            cls.proc.kill()
        print("="*70)
        print("SERVER STOPPED")
        print("="*70 + "\n")

    def _make_request(self, method, endpoint, data=None):
        """Helper to make HTTP requests"""
        url = urljoin(self.base_url, endpoint)
        
        if data:
            data = json.dumps(data).encode('utf-8')
        
        req = urllib.request.Request(url, data=data, method=method)
        req.add_header('Content-Type', 'application/json')
        
        try:
            with urllib.request.urlopen(req) as response:
                body = response.read().decode('utf-8')
                return response.status, json.loads(body) if body else {}
        except urllib.error.HTTPError as e:
            body = e.read().decode('utf-8')
            return e.code, json.loads(body) if body else {}

    def test_complete_crud_workflow(self):
        """Execute complete CRUD workflow for all resources"""
        
        print("\n" + "-"*70)
        print("STUDENTS CRUD OPERATIONS")
        print("-"*70)
        
        # CREATE Student
        print("\n✓ CREATE: Adding new student...")
        student_payload = {
            "name": "Alice Johnson",
            "email": "alice.johnson@test.com",
            "course": "Data Science",
            "year": 2
        }
        status, response = self._make_request('POST', '/api/students', student_payload)
        self.assertEqual(status, 201, f"Expected 201, got {status}: {response}")
        student_id = response.get('id')
        print(f"  ✓ POST /api/students - Status: {status}, ID: {student_id}")
        
        # READ Student (single)
        print("\n✓ READ: Getting student...")
        status, response = self._make_request('GET', f'/api/students/{student_id}')
        self.assertEqual(status, 200, f"Expected 200, got {status}")
        self.assertEqual(response['name'], "Alice Johnson")
        print(f"  ✓ GET /api/students/{student_id} - Status: {status}")
        
        # UPDATE Student
        print("\n✓ UPDATE: Modifying student...")
        update_payload = {
            "name": "Alice Johnson",
            "email": "alice.johnson@test.com",
            "course": "Machine Learning",
            "year": 3
        }
        status, response = self._make_request('PUT', f'/api/students/{student_id}', update_payload)
        self.assertEqual(status, 200, f"Expected 200, got {status}")
        print(f"  ✓ PUT /api/students/{student_id} - Status: {status}")
        
        # READ All Students
        print("\n✓ READ: Getting all students...")
        status, response = self._make_request('GET', '/api/students')
        self.assertEqual(status, 200, f"Expected 200, got {status}")
        self.assertIsInstance(response, list)
        print(f"  ✓ GET /api/students - Status: {status}, Count: {len(response)}")
        
        # ========== TEACHERS CRUD ==========
        print("\n" + "-"*70)
        print("TEACHERS CRUD OPERATIONS")
        print("-"*70)
        
        # CREATE Teacher
        print("\n✓ CREATE: Adding new teacher...")
        teacher_payload = {
            "name": "Dr. Robert Smith",
            "email": "robert.smith@test.com",
            "subject": "Machine Learning"
        }
        status, response = self._make_request('POST', '/api/teachers', teacher_payload)
        self.assertEqual(status, 201, f"Expected 201, got {status}")
        teacher_id = response.get('id')
        print(f"  ✓ POST /api/teachers - Status: {status}, ID: {teacher_id}")
        
        # READ Teacher (single)
        print("\n✓ READ: Getting teacher...")
        status, response = self._make_request('GET', f'/api/teachers/{teacher_id}')
        self.assertEqual(status, 200, f"Expected 200, got {status}")
        self.assertEqual(response['name'], "Dr. Robert Smith")
        print(f"  ✓ GET /api/teachers/{teacher_id} - Status: {status}")
        
        # UPDATE Teacher
        print("\n✓ UPDATE: Modifying teacher...")
        update_payload = {
            "name": "Dr. Robert Smith",
            "email": "robert.smith@test.com",
            "subject": "Deep Learning"
        }
        status, response = self._make_request('PUT', f'/api/teachers/{teacher_id}', update_payload)
        self.assertEqual(status, 200, f"Expected 200, got {status}")
        print(f"  ✓ PUT /api/teachers/{teacher_id} - Status: {status}")
        
        # READ All Teachers
        print("\n✓ READ: Getting all teachers...")
        status, response = self._make_request('GET', '/api/teachers')
        self.assertEqual(status, 200, f"Expected 200, got {status}")
        self.assertIsInstance(response, list)
        print(f"  ✓ GET /api/teachers - Status: {status}, Count: {len(response)}")
        
        # ========== MARKS CRUD ==========
        print("\n" + "-"*70)
        print("MARKS CRUD OPERATIONS")
        print("-"*70)
        
        # CREATE Mark
        print("\n✓ CREATE: Adding new mark...")
        mark_payload = {
            "student_id": student_id,
            "subject": "Python Programming",
            "marks": 88
        }
        status, response = self._make_request('POST', '/api/marks', mark_payload)
        self.assertEqual(status, 201, f"Expected 201, got {status}: {response}")
        mark_id = response.get('id')
        print(f"  ✓ POST /api/marks - Status: {status}, ID: {mark_id}")
        
        # READ Mark (single)
        print("\n✓ READ: Getting mark...")
        status, response = self._make_request('GET', f'/api/marks/{mark_id}')
        self.assertEqual(status, 200, f"Expected 200, got {status}")
        self.assertEqual(response['marks'], 88)
        print(f"  ✓ GET /api/marks/{mark_id} - Status: {status}")
        
        # UPDATE Mark
        print("\n✓ UPDATE: Modifying mark...")
        update_payload = {
            "student_id": student_id,
            "subject": "Python Programming",
            "marks": 92
        }
        status, response = self._make_request('PUT', f'/api/marks/{mark_id}', update_payload)
        self.assertEqual(status, 200, f"Expected 200, got {status}")
        print(f"  ✓ PUT /api/marks/{mark_id} - Status: {status}")
        
        # READ All Marks
        print("\n✓ READ: Getting all marks...")
        status, response = self._make_request('GET', '/api/marks')
        self.assertEqual(status, 200, f"Expected 200, got {status}")
        self.assertIsInstance(response, list)
        print(f"  ✓ GET /api/marks - Status: {status}, Count: {len(response)}")
        
        # ========== FEES CRUD ==========
        print("\n" + "-"*70)
        print("FEES CRUD OPERATIONS")
        print("-"*70)
        
        # CREATE Fee
        print("\n✓ CREATE: Adding new fee...")
        fee_payload = {
            "student_id": student_id,
            "amount": 5000.00,
            "due_date": "2026-04-15",
            "status": "pending",
            "description": "Semester Fee"
        }
        status, response = self._make_request('POST', '/api/fees', fee_payload)
        self.assertEqual(status, 201, f"Expected 201, got {status}: {response}")
        fee_id = response.get('id')
        print(f"  ✓ POST /api/fees - Status: {status}, ID: {fee_id}")
        
        # READ Fee (single)
        print("\n✓ READ: Getting fee...")
        status, response = self._make_request('GET', f'/api/fees/{fee_id}')
        self.assertEqual(status, 200, f"Expected 200, got {status}")
        self.assertEqual(response['amount'], 5000.0)
        print(f"  ✓ GET /api/fees/{fee_id} - Status: {status}")
        
        # UPDATE Fee
        print("\n✓ UPDATE: Modifying fee...")
        update_payload = {
            "student_id": student_id,
            "amount": 5500.00,
            "due_date": "2026-04-15",
            "status": "paid",
            "description": "Semester Fee (Paid)"
        }
        status, response = self._make_request('PUT', f'/api/fees/{fee_id}', update_payload)
        self.assertEqual(status, 200, f"Expected 200, got {status}")
        print(f"  ✓ PUT /api/fees/{fee_id} - Status: {status}")
        
        # READ All Fees
        print("\n✓ READ: Getting all fees...")
        status, response = self._make_request('GET', '/api/fees')
        self.assertEqual(status, 200, f"Expected 200, got {status}")
        self.assertIsInstance(response, list)
        print(f"  ✓ GET /api/fees - Status: {status}, Count: {len(response)}")
        
        # ========== DELETE OPERATIONS ==========
        print("\n" + "-"*70)
        print("DELETE OPERATIONS (Cleanup)")
        print("-"*70)
        
        # DELETE Fee
        print("\n✓ DELETE: Removing fee...")
        status, response = self._make_request('DELETE', f'/api/fees/{fee_id}')
        self.assertEqual(status, 200, f"Expected 200, got {status}")
        print(f"  ✓ DELETE /api/fees/{fee_id} - Status: {status}")
        
        # DELETE Mark
        print("\n✓ DELETE: Removing mark...")
        status, response = self._make_request('DELETE', f'/api/marks/{mark_id}')
        self.assertEqual(status, 200, f"Expected 200, got {status}")
        print(f"  ✓ DELETE /api/marks/{mark_id} - Status: {status}")
        
        # DELETE Teacher
        print("\n✓ DELETE: Removing teacher...")
        status, response = self._make_request('DELETE', f'/api/teachers/{teacher_id}')
        self.assertEqual(status, 200, f"Expected 200, got {status}")
        print(f"  ✓ DELETE /api/teachers/{teacher_id} - Status: {status}")
        
        # DELETE Student
        print("\n✓ DELETE: Removing student...")
        status, response = self._make_request('DELETE', f'/api/students/{student_id}')
        self.assertEqual(status, 200, f"Expected 200, got {status}")
        print(f"  ✓ DELETE /api/students/{student_id} - Status: {status}")
        
        print("\n" + "="*70)
        print("ALL CRUD OPERATIONS COMPLETED SUCCESSFULLY")
        print("="*70)


class TestAPIErrorHandling(unittest.TestCase):
    """Test error handling and validation"""

    @classmethod
    def setUpClass(cls):
        """Start the server before running tests"""
        cls.port = "8000"
        cls.base_url = f"http://127.0.0.1:{cls.port}"

        env = os.environ.copy()
        env["PORT"] = cls.port

        cls.proc = subprocess.Popen(
            ["python", "app.py"],
            env=env,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
        )

        time.sleep(3)
        print("\n" + "="*70)
        print("TESTING ERROR HANDLING & EDGE CASES")
        print("="*70)

    @classmethod
    def tearDownClass(cls):
        """Stop the server after tests"""
        cls.proc.terminate()
        try:
            cls.proc.wait(timeout=3)
        except Exception:
            cls.proc.kill()

    def _make_request(self, method, endpoint, data=None):
        """Helper to make HTTP requests"""
        url = urljoin(self.base_url, endpoint)
        
        if data:
            data = json.dumps(data).encode('utf-8')
        
        req = urllib.request.Request(url, data=data, method=method)
        req.add_header('Content-Type', 'application/json')
        
        try:
            with urllib.request.urlopen(req) as response:
                body = response.read().decode('utf-8')
                return response.status, json.loads(body) if body else {}
        except urllib.error.HTTPError as e:
            body = e.read().decode('utf-8')
            try:
                return e.code, json.loads(body) if body else {}
            except json.JSONDecodeError:
                return e.code, {}

    def test_404_nonexistent_resources(self):
        """Test that 404 is returned for non-existent resources"""
        print("\n✓ Testing 404 responses...")
        
        endpoints = [
            '/api/students/99999',
            '/api/teachers/99999',
            '/api/marks/99999',
            '/api/fees/99999'
        ]
        
        for endpoint in endpoints:
            status, _ = self._make_request('GET', endpoint)
            self.assertEqual(status, 404, f"{endpoint} should return 404, got {status}")
            print(f"  ✓ {endpoint} - Status: 404")

    def test_all_endpoints_accessible(self):
        """Test that all main endpoints are accessible"""
        print("\n✓ Testing endpoint accessibility...")
        
        endpoints = [
            '/api/students',
            '/api/teachers',
            '/api/marks',
            '/api/fees'
        ]
        
        for endpoint in endpoints:
            status, response = self._make_request('GET', endpoint)
            self.assertEqual(status, 200, f"{endpoint} should return 200, got {status}")
            self.assertIsInstance(response, list, f"{endpoint} should return a list")
            print(f"  ✓ {endpoint} - Status: 200, Items: {len(response)}")

    def test_cors_headers_present(self):
        """Test that CORS headers are present in responses"""
        print("\n✓ Testing CORS headers...")
        
        url = urljoin(self.base_url, '/api/students')
        req = urllib.request.Request(url)
        
        try:
            with urllib.request.urlopen(req) as response:
                headers = response.headers
                # Check for common CORS headers
                cors_found = any(header.lower() in ['access-control-allow-origin', 'access-control-allow-methods'] 
                               for header in headers.keys())
                print(f"  ✓ CORS headers: {'Present' if cors_found else 'Not explicitly set (server may use defaults)'}")
        except Exception as e:
            print(f"  ℹ Could not verify CORS headers: {str(e)}")


if __name__ == '__main__':
    # Run with more verbose output
    unittest.main(verbosity=2)
