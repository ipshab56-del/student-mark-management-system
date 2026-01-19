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
  setTableCallbacks(editStudent, deleteStudentAction, viewProfile);

  // Start by fetching and displaying all student data immediately upon load
  loadStudents();

  // --- Handle Form Submissions ---

  // Attach a listener to the 'submit' event of the student input form
  $("studentForm").addEventListener("submit", async (e) => {
    // Prevent the browser's default form submission behavior (page refresh)
    e.preventDefault(); 

    // Collect data from the input fields using the custom '$' selector
    const data = {
      name: $("name").value.trim(),   // Get name value, remove whitespace
      email: $("email").value.trim(), // Get email value
      course: $("course").value.trim(), // Get course value
      year: $("year").value.trim()    // Get year value
    };

    // Check the application state to see if we are currently editing an existing record
    const { editingId } = getState();

    // Use a ternary operator to decide which action to take:
    editingId
      ? await updateStudent(editingId, data) // If editingId exists, update the student
      : await createNewStudent(data);        // Otherwise, create a new student
  });

  // --- Handle Cancel Button Click ---

  // Attach a listener to the 'click' event of the cancel button
  $("cancelBtn").addEventListener("click", () => {
    // Clear the editing state (set the ID to null)
    setState({ editingId: null });
    // Clear all input fields in the form
    resetForm();
  });
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

// View student profile
export function viewProfile(id) {
  // Navigate to the profile page with the student ID as a query parameter
  window.history.pushState(null, "", `/profile?id=${id}`);
  // Trigger the router to load the profile page
  import("../router/viewRouter.js").then(module => module.router());
}
