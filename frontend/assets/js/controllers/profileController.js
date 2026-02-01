import { apiGetAll } from "../services/studentService.js";
import { apiMarkGetAll } from "../services/markService.js";
import { apiFeeGetAll } from "../services/feeService.js";
import { apiTeacherGetAll } from "../services/teacherService.js";
import { $ } from "../utils/dom.js";

// Initialize the profile controller
export function initProfileController() {
  loadAllStudentProfiles();
}

// Load and display all student profiles
async function loadAllStudentProfiles() {
  try {
    const allStudents = await apiGetAll();
    
    if (!allStudents || allStudents.length === 0) {
      showError("No students found");
      return;
    }

    const allMarks = await apiMarkGetAll();
    const allFees = await apiFeeGetAll();
    const teachers = await apiTeacherGetAll();

    displayAllProfiles(allStudents, allMarks, allFees, teachers);
  } catch (error) {
    console.error("Error loading profiles:", error);
    showError("Error loading profiles");
  }
}

// Display all student profiles
function displayAllProfiles(students, allMarks, allFees, teachers) {
  $("loading").style.display = "none";
  $("error").style.display = "none";
  $("profileContent").style.display = "block";

  const profilesContainer = $("profilesContainer");
  profilesContainer.innerHTML = "";

  // Create table wrapper
  const tableWrapper = document.createElement("div");
  tableWrapper.className = "report-table-container";
  
  const table = document.createElement("table");
  table.className = "table report-table";
  
  const thead = document.createElement("thead");
  thead.innerHTML = `
    <tr>
      <th class="px-4 py-3 text-left font-bold border-b">ID</th>
      <th class="px-4 py-3 text-left font-bold border-b">Name</th>
      <th class="px-4 py-3 text-left font-bold border-b">Email</th>
      <th class="px-4 py-3 text-left font-bold border-b">Course</th>
      <th class="px-4 py-3 text-center font-bold border-b">Action</th>
    </tr>
  `;
  
  const tbody = document.createElement("tbody");
  
  table.appendChild(thead);
  table.appendChild(tbody);
  tableWrapper.appendChild(table);
  profilesContainer.appendChild(tableWrapper);

  // Add student rows
  students.forEach((student, index) => {
    const studentMarks = allMarks.filter(mark => mark.student_id === student.id);
    const studentFees = allFees.filter(fee => fee.student_id === student.id);

    const row = document.createElement("tr");
    row.style.cursor = "pointer";
    
    row.innerHTML = `
      <td class="px-4 py-3 font-medium">${student.id}</td>
      <td class="px-4 py-3">${student.name}</td>
      <td class="px-4 py-3">${student.email}</td>
      <td class="px-4 py-3">${student.course}</td>
      <td class="px-4 py-3 text-center font-medium">Click to View</td>
    `;

    row.addEventListener("click", () => {
      displayStudentDetailsModal(student, studentMarks, studentFees, teachers);
    });

    tbody.appendChild(row);
  });
}

// Display student details modal
function displayStudentDetailsModal(student, studentMarks, studentFees, teachers) {
  const modal = document.getElementById('profileModal');
  const modalContent = document.getElementById('modalProfileContent');
  
  modalContent.innerHTML = `
    <div class="profile-info">
      <h3>Student Profile Details</h3>
      <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #ccc; border-radius: 8px;">
        <p><strong>ID:</strong> ${student.id}</p>
        <p><strong>Name:</strong> ${student.name}</p>
        <p><strong>Email:</strong> ${student.email}</p>
        <p><strong>Course:</strong> ${student.course}</p>
        <p><strong>Year:</strong> ${student.year}</p>
      </div>
      
      <h3>Academic Marks</h3>
      <div style="margin-bottom: 20px;">
        ${studentMarks.length === 0 ? 
          '<p>No marks recorded</p>' : 
          studentMarks.map(mark => `
            <div style="padding: 10px; margin: 5px 0; border: 1px solid #ddd; border-radius: 5px;">
              <p><strong>Mathematics:</strong> ${mark.mathematics || 'N/A'}</p>
              <p><strong>Literature:</strong> ${mark.literature || 'N/A'}</p>
              <p><strong>Core:</strong> ${mark.core || 'N/A'}</p>
              <p><strong>Percentage:</strong> ${mark.percentage || 'N/A'}%</p>
            </div>
          `).join('')
        }
      </div>
      
      <h3>Fee Records</h3>
      <div>
        ${studentFees.length === 0 ? 
          '<p>No fee records</p>' : 
          studentFees.map(fee => `
            <div style="padding: 10px; margin: 5px 0; border: 1px solid #ddd; border-radius: 5px;">
              <p><strong>Amount:</strong> $${fee.amount}</p>
              <p><strong>Due Date:</strong> ${fee.due_date}</p>
              <p><strong>Status:</strong> ${fee.status}</p>
              <p><strong>Description:</strong> ${fee.description || 'N/A'}</p>
            </div>
          `).join('')
        }
      </div>
    </div>
  `;
  
  modal.style.display = 'block';
  
  // Add close functionality after modal is shown
  const closeBtn = modal.querySelector('.close');
  if (closeBtn) {
    closeBtn.onclick = function() {
      modal.style.display = 'none';
    };
  }
  
  // Close when clicking outside
  modal.onclick = function(event) {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  };
}

// Show error message
function showError(message) {
  $("loading").style.display = "none";
  $("profileContent").style.display = "none";
  $("error").style.display = "block";
  $("error").textContent = message;
}