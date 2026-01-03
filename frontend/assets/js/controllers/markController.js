import { apiMarkGetAll, apiMarkCreate, apiMarkGetOne, apiMarkUpdate, apiMarkDelete } from "../services/markService.js";
import { apiGetAll } from "../services/studentService.js";
import { renderMarkTable } from "../components/MarkTable.js";
import { resetMarkForm, fillMarkForm } from "../components/MarkForm.js";
import { setState, getState } from "../state/store.js";
import { showAlert } from "../components/alert.js";
import { $ } from "../utils/dom.js";

export function initMarkController() {
  console.log("CONTROLLER: mark controller initialized");
  loadMarks();
  loadStudents();

  $("markForm").addEventListener("submit", async e => {
    e.preventDefault();

    const data = {
      student_id: $("m_student_id").value.trim(),
      subject: $("m_subject").value.trim(),
      marks: $("m_marks").value.trim()
    };

    const { markEditingId } = getState();

    markEditingId
      ? await updateMark(markEditingId, data)
      : await createMark(data);
  });

  $("m_cancelBtn").onclick = () => {
    resetMarkForm();
    setState({ markEditingId: null });
  };
}

export async function loadMarks() {
  const marks = await apiMarkGetAll();
  setState({ marks });
  renderMarkTable(marks);
}

export async function loadStudents() {
  const students = await apiGetAll();
  setState({ students });
  
  const select = $("m_student_id");
  select.innerHTML = '<option value="">Select Student</option>';
  students.forEach(student => {
    select.innerHTML += `<option value="${student.id}">${student.name}</option>`;
  });
}

export async function createMark(data) {
  const res = await apiMarkCreate(data);
  if (res.ok) {
    showAlert("Mark added!");
    resetMarkForm();
    loadMarks();
  }
}

export async function editMark(id) {
  const mark = await apiMarkGetOne(id);
  setState({ markEditingId: id });
  fillMarkForm(mark);
}

export async function updateMark(id, data) {
  const res = await apiMarkUpdate(id, data);
  if (res.ok) {
    showAlert("Mark updated!");
    resetMarkForm();
    setState({ markEditingId: null });
    loadMarks();
  }
}

export async function deleteMarkAction(id) {
  if (!confirm("Delete this mark?")) return;
  const res = await apiMarkDelete(id);
  if (res.ok) {
    showAlert("Mark deleted!");
    loadMarks();
  }
}