import { $ } from "../utils/dom.js";

export function resetTeacherForm() {
  $("teacherForm").reset();
  $("t_submitBtn").textContent = "Add Teacher";
  $("t_cancelBtn").style.display = "none";
}

export function fillTeacherForm(teacher) {
  $("t_name").value = teacher.name;
  $("t_email").value = teacher.email;
  $("t_subject").value = teacher.subject;

  $("t_submitBtn").textContent = "Update Teacher";
  $("t_cancelBtn").style.display = "inline-block";
}
