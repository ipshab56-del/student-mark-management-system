import { apiGetAll } from "../services/studentService.js";
import { apiMarkGetAll } from "../services/markService.js";
import { apiTeacherGetAll } from "../services/teacherService.js";

export function initReportController() {
  console.log("CONTROLLER: report controller initialized");
  loadReport();
}

async function loadReport() {
  const tbody = document.getElementById("reportTableBody");
  if (!tbody) return;

  // Show loading state
  tbody.innerHTML = '<tr><td colspan="9" class="text-center">Loading report data...</td></tr>';

  try {
    const [students, marks, teachers] = await Promise.all([
      apiGetAll(),
      apiMarkGetAll(),
      apiTeacherGetAll(),
    ]);

    // Clear loading state
    tbody.innerHTML = "";

    if (students.length === 0) {
      tbody.innerHTML = '<tr><td colspan="9" class="text-center">No student data found</td></tr>';
      return;
    }

    students.forEach((student) => {
      const studentMarks = marks.filter((m) => m.student_id === student.id);

      if (studentMarks.length === 0) {
        tbody.innerHTML += `
          <tr>
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.email}</td>
            <td>${student.course}</td>
            <td>${student.year}</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
          </tr>
        `;
      } else {
        const totalMarks = studentMarks.reduce((sum, m) => sum + m.marks, 0);
        const percentage = ((totalMarks / (studentMarks.length * 100)) * 100).toFixed(2);

        studentMarks.forEach((mark) => {
          const teacher = teachers.find((t) => t.subject === mark.subject);
          tbody.innerHTML += `
            <tr>
              <td>${student.id}</td>
              <td>${student.name}</td>
              <td>${student.email}</td>
              <td>${student.course}</td>
              <td>${student.year}</td>
              <td>${mark.subject}</td>
              <td>${teacher ? teacher.name : "-"}</td>
              <td>${mark.marks}</td>
              <td>${percentage}%</td>
            </tr>
          `;
        });
      }
    });
  } catch (error) {
    console.error("Error loading report data:", error);
    tbody.innerHTML = '<tr><td colspan="9" class="text-center text-red">Error loading report data. Please try again.</td></tr>';
  }
}

