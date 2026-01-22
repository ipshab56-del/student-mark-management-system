import { $ } from "../utils/dom.js";

// Store callbacks for edit and delete actions
let onEdit = null;
let onDelete = null;

// Set the callback functions for edit and delete actions
export function setTableCallbacks(editCallback, deleteCallback) {
  onEdit = editCallback;
  onDelete = deleteCallback;
}

// Renders the list of students into an HTML table
export function renderStudentTable(students) {
  // Get references to the table body where rows will be inserted and the 'no students' message
  const body = $("studentsTableBody");
  const noStudents = $("noStudents");

  // Clear any existing rows from the table body before rendering new data
  body.innerHTML = "";

  // Check if the student array is empty
  if (students.length === 0) {
    // If no students are found, display the 'no students' message and stop execution
    noStudents.style.display = "block";
    return;
  }

  // If students exist, hide the 'no students' message
  noStudents.style.display = "none";

  // Iterate over each student object in the provided array
  students.forEach(student => {
    // Create a new table row element for the current student
    const row = document.createElement("tr");
    row.className = "border-b"; // Add styling class (likely Tailwind CSS)

    // Populate the row with dynamic HTML content using a template literal
    row.innerHTML = `
      <td class="px-3 py-2">${student.id}</td>
      <td class="px-3 py-2">${student.name}</td>
      <td class="px-3 py-2">${student.email}</td>
      <td class="px-3 py-2">${student.course}</td>
      <td class="px-3 py-2">${student.year}</td>
      <td class="px-3 py-2 min-w-max">
        <div class="flex gap-2 items-center justify-start h-full">
          <button class="bg-blue-500 hover:bg-blue-600 text-white text-sm py-1.5 px-3 rounded transition-colors inline-block"
            data-edit="${student.id}" title="Edit">Edit</button>
          <button class="bg-red-500 hover:bg-red-600 text-white text-sm py-1.5 px-3 rounded transition-colors inline-block"
            data-delete="${student.id}" title="Delete">Delete</button>
        </div>
      </td>
    `;

    // --- Attach event listeners to the newly created buttons ---

    // Find the 'Edit' button within this specific row and attach a click handler
    // When clicked, call the editStudent function with the correct student ID
    if (onEdit) {
      row.querySelector("[data-edit]").onclick = () => onEdit(student.id);
    }
    
    // Find the 'Delete' button within this specific row and attach a click handler
    // When clicked, call the deleteStudentAction function with the correct student ID
    if (onDelete) {
      row.querySelector("[data-delete]").onclick = () => onDelete(student.id);
    }

    // Append the fully constructed row to the table body
    body.appendChild(row);
  });
}