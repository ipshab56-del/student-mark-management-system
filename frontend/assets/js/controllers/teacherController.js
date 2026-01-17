import {
  apiTeacherGetAll, apiTeacherCreate, apiTeacherGetOne,
  apiTeacherUpdate, apiTeacherDelete
} from "../services/teacherService.js";

import { renderTeacherTable, setTeacherTableCallbacks } from "../components/TeacherTable.js";
import { resetTeacherForm, fillTeacherForm } from "../components/TeacherForm.js";
import { setState, getState } from "../state/store.js";
import { showAlert } from "../components/alert.js";
import { $ } from "../utils/dom.js";

export function initTeacherController() {
  console.log("CONTROLLER: teacher controller initialized");
  
  // Set up callbacks for table actions (avoids circular dependency)
  setTeacherTableCallbacks(editTeacher, deleteTeacherAction);
  
  loadTeachers();

  $("teacherForm").addEventListener("submit", async e => {
    e.preventDefault();

    const data = {
      name: $("t_name").value.trim(),
      email: $("t_email").value.trim(),
      subject: $("t_subject").value.trim()
    };

    const { teacherEditingId } = getState();

    teacherEditingId
      ? await updateTeacher(teacherEditingId, data)
      : await createTeacher(data);
  });

  $("t_cancelBtn").onclick = () => {
    resetTeacherForm();
    setState({ teacherEditingId: null });
  };
}

export async function loadTeachers() {
  console.log("LOAD: fetching teachers from API...");
  const teachers = await apiTeacherGetAll();
  setState({ teachers });
  renderTeacherTable(teachers);
}

export async function createTeacher(data) {
  const res = await apiTeacherCreate(data);
  if (res.ok) {
    showAlert("Teacher added!");
    resetTeacherForm();
    loadTeachers();
  }
}

export async function editTeacher(id) {
  const teacher = await apiTeacherGetOne(id);
  setState({ teacherEditingId: id });
  fillTeacherForm(teacher);
}

export async function updateTeacher(id, data) {
  const res = await apiTeacherUpdate(id, data);
  if (res.ok) {
    showAlert("Teacher updated!");
    resetTeacherForm();
    setState({ teacherEditingId: null });
    loadTeachers();
  }
}

export async function deleteTeacherAction(id) {
  if (!confirm("Delete this teacher?")) return;
  const res = await apiTeacherDelete(id);
  if (res.ok) {
    showAlert("Teacher deleted!");
    loadTeachers();
  }
}
