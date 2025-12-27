import { $ } from "../utils/dom.js";
import { editTeacher, deleteTeacherAction } from "../controllers/teacherController.js";

export function renderTeacherTable(teachers) {
  const body = $("teachersTableBody");
  const noTeachers = $("noTeachers");

  body.innerHTML = "";

  if (!teachers.length) {
    noTeachers.style.display = "block";
    return;
  }

  noTeachers.style.display = "none";

  teachers.forEach(t => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${t.id}</td>
      <td>${t.name}</td>
      <td>${t.email}</td>
      <td>${t.subject}</td>
      <td class="flex gap-2">
        <button class="btn btn-primary" data-edit="${t.id}">Edit</button>
        <button class="btn btn-danger" data-delete="${t.id}">Delete</button>
      </td>
    `;

    row.querySelector("[data-edit]").onclick = () => editTeacher(t.id);
    row.querySelector("[data-delete]").onclick = () => deleteTeacherAction(t.id);

    body.appendChild(row);
  });
}
