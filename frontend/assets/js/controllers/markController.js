import { apiMarkGetAll, apiMarkCreate, apiMarkGetOne, apiMarkUpdate, apiMarkDelete } from "../services/markService.js";
import { apiGetAll } from "../services/studentService.js";
import { renderMarkTable, setMarkTableCallbacks } from "../components/MarkTable.js";
import { resetMarkForm, fillMarkForm } from "../components/MarkForm.js";
import { setState, getState } from "../state/store.js";
import { showAlert } from "../components/alert.js";
import { $ } from "../utils/dom.js";

export function initMarkController() {
  console.log("CONTROLLER: mark controller initialized");
  
  // Set up callbacks for table actions (avoids circular dependency)
  setMarkTableCallbacks(editMark, deleteMarkAction);
  
  loadMarks();
  loadStudents();

  $("markForm").addEventListener("submit", async e => {
    e.preventDefault();

    const studentId = $("m_student_id").value.trim();
    const mathematics = $("m_mathematics").value.trim();
    const literature = $("m_literature").value.trim();
    const core = $("m_core").value.trim();

    const { markEditingId } = getState();

    if (markEditingId) {
      // For editing, update all marks for the student
      await updateMarksForStudent(studentId, mathematics, literature, core);
    } else {
      // For creating, add marks for all subjects
      await createMarksForStudent(studentId, mathematics, literature, core);
    }
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

export async function editMark(studentId) {
  // For editing, we need to load all marks for the student
  const marks = await apiMarkGetAll();
  const studentMarks = marks.filter(m => m.student_id == studentId);

  const studentData = {
    student_id: studentId,
    mathematics: studentMarks.find(m => m.subject === 'mathematics')?.marks || '',
    literature: studentMarks.find(m => m.subject === 'literature')?.marks || '',
    core: studentMarks.find(m => m.subject === 'core')?.marks || ''
  };

  setState({ markEditingId: studentId });
  fillMarkForm(studentData);
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

export async function deleteMarkAction(studentId) {
  if (!confirm("Delete all marks for this student?")) return;
  // Delete all marks for the student
  const marks = await apiMarkGetAll();
  const studentMarks = marks.filter(m => m.student_id == studentId);
  for (const mark of studentMarks) {
    const res = await apiMarkDelete(mark.id);
    if (!res.ok) {
      showAlert("Failed to delete some marks!");
      return;
    }
  }
  showAlert("Marks deleted!");
  loadMarks();
}

export async function createMarksForStudent(studentId, mathematics, literature, core) {
  const subjects = [
    { subject: 'mathematics', marks: mathematics },
    { subject: 'literature', marks: literature },
    { subject: 'core', marks: core }
  ];

  for (const subj of subjects) {
    if (subj.marks) {
      const data = {
        student_id: studentId,
        subject: subj.subject,
        marks: subj.marks
      };
      const res = await apiMarkCreate(data);
      if (!res.ok) {
        showAlert(`Failed to add ${subj.subject} mark!`);
        return;
      }
    }
  }
  showAlert("Marks added!");
  resetMarkForm();
  loadMarks();
}

export async function updateMarksForStudent(studentId, mathematics, literature, core) {
  // First, get existing marks for the student
  const marks = await apiMarkGetAll();
  const studentMarks = marks.filter(m => m.student_id == studentId);

  const subjects = [
    { subject: 'mathematics', marks: mathematics },
    { subject: 'literature', marks: literature },
    { subject: 'core', marks: core }
  ];

  for (const subj of subjects) {
    const existingMark = studentMarks.find(m => m.subject === subj.subject);
    if (subj.marks) {
      if (existingMark) {
        // Update existing
        const data = {
          student_id: studentId,
          subject: subj.subject,
          marks: subj.marks
        };
        const res = await apiMarkUpdate(existingMark.id, data);
        if (!res.ok) {
          showAlert(`Failed to update ${subj.subject} mark!`);
          return;
        }
      } else {
        // Create new
        const data = {
          student_id: studentId,
          subject: subj.subject,
          marks: subj.marks
        };
        const res = await apiMarkCreate(data);
        if (!res.ok) {
          showAlert(`Failed to add ${subj.subject} mark!`);
          return;
        }
      }
    } else if (existingMark) {
      // Delete if no marks provided and exists
      const res = await apiMarkDelete(existingMark.id);
      if (!res.ok) {
        showAlert(`Failed to delete ${subj.subject} mark!`);
        return;
      }
    }
  }
  showAlert("Marks updated!");
  resetMarkForm();
  setState({ markEditingId: null });
  loadMarks();
}
