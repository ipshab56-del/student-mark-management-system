import { $ } from "../utils/dom.js";

export function resetMarkForm() {
  $("markForm").reset();
  $("m_submitBtn").textContent = "Add Mark";
  $("m_cancelBtn").style.display = "none";
}

export function fillMarkForm(mark) {
  $("m_student_id").value = mark.student_id;
  $("m_subject").value = mark.subject;
  $("m_marks").value = mark.marks;

  $("m_submitBtn").textContent = "Update Mark";
  $("m_cancelBtn").style.display = "inline-block";
}