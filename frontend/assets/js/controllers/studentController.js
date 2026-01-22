import { 
    apiGetAll, 
    apiGetOne, 
    apiCreate, 
    apiUpdate, 
    apiDelete 
} from "../services/studentService.js";


import { showAlert } from "../components/alert.js";
import { renderStudentTable, setTableCallbacks } from "../components/StudentTable.js";
import { resetForm, fillForm } from "../components/StudentForm.js";

import { setState, getState } from "../state/store.js";
import { $, createElement } from "../utils/dom.js";

// Setup event listeners and load initial data
// Initialize the main logic and set up all necessary event listeners
export function initStudentController() {
  console.log("CONTROLLER: student controller initialized");

  // Set up callbacks for table actions (avoids circular dependency)
  setTableCallbacks(editStudent, deleteStudentAction);

  // Start by fetching and displaying all student data immediately upon load
  loadStudents();

  // --- Handle Course Fee Form ---
  const courseFeeForm = $("courseFeeForm");
  if (courseFeeForm) {
    courseFeeForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const courseName = $("courseName").value.trim();
      const courseAmount = parseFloat($("courseFeeAmount").value);
      const selectedStudentId = $("courseFeeStudent").value;

      if (courseName && courseAmount) {
        setState({ courseFeeData: { name: courseName, amount: courseAmount } });
        await updateFeeStats(courseName, selectedStudentId);
        courseFeeForm.reset();
        showAlert("Course fee information updated!");
      }
    });
  }

  const courseFeeStudent = $("courseFeeStudent");
  if (courseFeeStudent) {
    courseFeeStudent.addEventListener("change", async (e) => {
      const studentId = e.target.value;
      const { courseFeeData } = getState();
      if (studentId && courseFeeData) {
        await updateFeeStats(courseFeeData.name, studentId);
      }
    });
  }

  const courseFeeCancel = $("courseFeeCancel");
  if (courseFeeCancel) {
    courseFeeCancel.addEventListener("click", () => {
      if (courseFeeForm) courseFeeForm.reset();
    });
  }

  // --- Handle Form Submissions ---
  const studentForm = $("studentForm");
  if (studentForm) {
    studentForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const data = {
        name: $("name").value.trim(),
        email: $("email").value.trim(),
        course: $("course").value.trim(),
        year: $("year").value.trim()
      };
      const { editingId } = getState();
      editingId
        ? await updateStudent(editingId, data)
        : await createNewStudent(data);
    });
  }

  // --- Handle Cancel Button Click ---
  const cancelBtn = $("cancelBtn");
  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      setState({ editingId: null });
      resetForm();
    });
  }
}


// Fetch all student data from the API and update the user interface
export async function loadStudents() {
  const table = $("studentsTableContainer");

  if (!table) return; // safety guard

  const students = await apiGetAll();

  setState({ students });
  renderStudentTable(students);
}





// Create a new student
export async function createNewStudent(data) {
  const res = await apiCreate(data);
  if (res.ok) {
    showAlert("Student added!");
    resetForm();
    loadStudents();
  }
}

// Load a student into the form for editing
export async function editStudent(id) {
  const student = await apiGetOne(id);

  setState({ editingId: id });
  fillForm(student);

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Update an existing student
export async function updateStudent(id, data) {
  const res = await apiUpdate(id, data);
  if (res.ok) {
    showAlert("Updated!");
    resetForm();
    setState({ editingId: null });
    loadStudents();
  }
}

// Delete a student
export async function deleteStudentAction(id) {
  if (!confirm("Delete this student?")) return;
  const res = await apiDelete(id);
 	if (res.ok) {
    showAlert("Deleted!");
    loadStudents();
  }
}

// View student profile (not used in students table anymore)
export function viewProfile(id) {
  console.log("=== viewProfile called with ID:", id);
  
  // Store student ID in state
  console.log("=== Setting state with profileStudentId:", id);
  setState({ profileStudentId: id });
  
  console.log("=== State after setting:", getState());
  console.log("=== Student ID stored in state:", id);
  
  // Navigate using SPA router with pushState
  console.log("=== Pushing state to /profile");
  window.history.pushState(null, "", `/profile`);
  
  // Trigger the router to load the profile page
  console.log("=== Calling router");
  import("../router/viewRouter.js").then(module => {
    console.log("=== Router module imported, calling router()");
    module.router();
  });
}