import { $ } from "../utils/dom.js";

// Store callbacks for edit and delete actions
let onEdit = null;
let onDelete = null;

// Set the callback functions for edit and delete actions
export function setMarkTableCallbacks(editCallback, deleteCallback) {
  onEdit = editCallback;
  onDelete = deleteCallback;
}

export function renderMarkTable(marks) {
  const body = $("marksTableBody");
  const noMarks = $("noMarks");

  body.innerHTML = "";

  if (marks.length === 0) {
    noMarks.style.display = "block";
    return;
  }

  noMarks.style.display = "none";

  // Group marks by student
  const studentMarks = {};
  marks.forEach(mark => {
    if (!studentMarks[mark.student_id]) {
      studentMarks[mark.student_id] = {
        student_name: mark.student_name || 'Unknown',
        marks: {}
      };
    }
    studentMarks[mark.student_id].marks[mark.subject] = mark.marks;
    studentMarks[mark.student_id].id = mark.id; // Assuming one ID per student for simplicity
  });

  Object.keys(studentMarks).forEach(studentId => {
    const studentData = studentMarks[studentId];
    const row = document.createElement("tr");
    row.className = "border-b";

    row.innerHTML = `
      <td class="px-3 py-2">${studentData.id}</td>
      <td class="px-3 py-2">${studentData.student_name}</td>
      <td class="px-3 py-2">${studentData.marks.mathematics || '-'}</td>
      <td class="px-3 py-2">${studentData.marks.literature || '-'}</td>
      <td class="px-3 py-2">${studentData.marks.core || '-'}</td>
      <td class="px-3 py-2 flex space-x-2">
        <button class="bg-yellow-400 hover:bg-yellow-500 text-black py-1 px-3 rounded"
          data-edit="${studentData.id}">Edit</button>
        <button class="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
          data-delete="${studentData.id}">Delete</button>
      </td>
    `;

    row.querySelector("[data-edit]").onclick = () => onEdit ? onEdit(studentData.id) : null;
    row.querySelector("[data-delete]").onclick = () => onDelete ? onDelete(studentData.id) : null;

    body.appendChild(row);
  });
}
