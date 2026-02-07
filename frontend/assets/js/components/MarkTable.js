import { $ } from "../utils/dom.js";
import { getState } from "../state/store.js";

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
        student_id: mark.student_id,
        student_name: mark.student_name || 'Unknown',
        marks: {}
      };
    }
    studentMarks[mark.student_id].marks[mark.subject] = mark.marks;
  });

  // Get students to map core subjects
  const students = getState().students || [];

  Object.keys(studentMarks).forEach(studentId => {
    const studentData = studentMarks[studentId];
    const student = students.find(s => s.id == studentId);
    const coreMarks = student ? studentData.marks[student.course] || '-' : '-';
    const row = document.createElement("tr");
    row.className = "border-b";

    // Calculate percentage
    const markValues = [
      studentData.marks.mathematics || 0,
      studentData.marks.literature || 0,
      parseInt(coreMarks) || 0
    ].map(m => parseInt(m) || 0);

    const totalMarks = markValues.reduce((sum, m) => sum + m, 0);
    const percentage = markValues.length > 0 ? ((totalMarks / (markValues.length * 100)) * 100).toFixed(2) : 0;

    row.innerHTML = `
      <td class="px-3 py-2">${studentData.student_id}</td>
      <td class="px-3 py-2">${studentData.student_name}</td>
      <td class="px-3 py-2">${studentData.marks.mathematics || '-'}</td>
      <td class="px-3 py-2">${studentData.marks.literature || '-'}</td>
      <td class="px-3 py-2">${coreMarks || '-'}</td>
      <td class="px-3 py-2 font-bold text-blue-600">${percentage}%</td>
      <td class="px-3 py-2 flex space-x-2">
        <button class="edit-btn"
          data-edit="${studentData.student_id}">Edit</button>
        <button class="delete-btn"
          data-delete="${studentData.student_id}">Delete</button>
      </td>
    `;

    row.querySelector("[data-edit]").onclick = () => onEdit ? onEdit(studentData.student_id) : null;
    row.querySelector("[data-delete]").onclick = () => onDelete ? onDelete(studentData.student_id) : null;

    body.appendChild(row);
  });
}
