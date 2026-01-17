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

  marks.forEach(mark => {
    const row = document.createElement("tr");
    row.className = "border-b";

    row.innerHTML = `
      <td class="px-3 py-2">${mark.id}</td>
      <td class="px-3 py-2">${mark.student_name || 'Unknown'}</td>
      <td class="px-3 py-2">${mark.subject}</td>
      <td class="px-3 py-2">${mark.marks}</td>
      <td class="px-3 py-2 flex space-x-2">
        <button class="bg-yellow-400 hover:bg-yellow-500 text-black py-1 px-3 rounded"
          data-edit="${mark.id}">Edit</button>
        <button class="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
          data-delete="${mark.id}">Delete</button>
      </td>
    `;

    row.querySelector("[data-edit]").onclick = () => onEdit ? onEdit(mark.id) : null;
    row.querySelector("[data-delete]").onclick = () => onDelete ? onDelete(mark.id) : null;

    body.appendChild(row);
  });
}