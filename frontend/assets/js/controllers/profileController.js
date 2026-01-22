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
  const modalOverlay = document.createElement("div");
  modalOverlay.className = "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4";
  
  const modal = document.createElement("div");
  modal.className = "bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto";
  modal.innerHTML = `
    <div class="sticky top-0 bg-indigo-600 text-white p-4 flex justify-between items-center">
      <h2 class="text-2xl font-bold">${student.name} - Student Details</h2>
      <button class="text-white text-2xl hover:text-gray-200" id="closeModal">&times;</button>
    </div>

    <div class="p-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-indigo-50 p-4 rounded">
        <div>
          <label class="block text-sm font-medium text-gray-700">Student ID</label>
          <p class="mt-1 text-lg font-bold text-indigo-600">${student.id}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Name</label>
          <p class="mt-1 text-lg font-bold">${student.name}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <p class="mt-1 text-sm">${student.email}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Course</label>
          <p class="mt-1 text-lg font-bold">${student.course}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Year</label>
          <p class="mt-1 text-lg font-bold">${student.year}</p>
        </div>
      </div>

      <h3 class="text-xl font-bold mb-4 text-indigo-600">Academic Marks</h3>
      <div id="marksSection" class="mb-8 overflow-x-auto">
        <table class="w-full border border-gray-300">
          <thead>
            <tr class="bg-gray-100">
              <th class="px-4 py-2 border text-left">Subject</th>
              <th class="px-4 py-2 border text-left">Marks</th>
              <th class="px-4 py-2 border text-left">Teacher</th>
              <th class="px-4 py-2 border text-left">Date</th>
            </tr>
          </thead>
          <tbody id="marksTableBody"></tbody>
        </table>
      </div>

      <h3 class="text-xl font-bold mb-4 text-indigo-600">Fee Records</h3>
      <div id="feesSection" class="mb-8 overflow-x-auto">
        <table class="w-full border border-gray-300">
          <thead>
            <tr class="bg-gray-100">
              <th class="px-4 py-2 border text-left">Amount</th>
              <th class="px-4 py-2 border text-left">Due Date</th>
              <th class="px-4 py-2 border text-left">Status</th>
              <th class="px-4 py-2 border text-left">Description</th>
              <th class="px-4 py-2 border text-left">Date</th>
            </tr>
          </thead>
          <tbody id="feesTableBody"></tbody>
        </table>
      </div>
    </div>
  `;

  modalOverlay.appendChild(modal);
  document.body.appendChild(modalOverlay);

  modal.querySelector("#closeModal").addEventListener("click", () => modalOverlay.remove());
  
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) modalOverlay.remove();
  });

  // Fill marks and fees tables
  const marksTableBody = modal.querySelector("#marksTableBody");
  if (studentMarks.length === 0) {
    marksTableBody.innerHTML = "<tr><td colspan='4' class='px-4 py-2 text-gray-500'>No marks found</td></tr>";
  } else {
    studentMarks.forEach(mark => {
      const teacher = teachers.find(t => t.subject.toLowerCase() === mark.subject.toLowerCase());
      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="px-4 py-2 border">${mark.subject}</td>
        <td class="px-4 py-2 border">${mark.marks}</td>
        <td class="px-4 py-2 border">${teacher ? teacher.name : "N/A"}</td>
        <td class="px-4 py-2 border">${mark.created_at || "N/A"}</td>
      `;
      marksTableBody.appendChild(row);
    });
  }

  const feesTableBody = modal.querySelector("#feesTableBody");
  if (studentFees.length === 0) {
    feesTableBody.innerHTML = "<tr><td colspan='5' class='px-4 py-2 text-gray-500'>No fees found</td></tr>";
  } else {
    studentFees.forEach(fee => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="px-4 py-2 border">${fee.amount}</td>
        <td class="px-4 py-2 border">${fee.due_date}</td>
        <td class="px-4 py-2 border">${fee.status}</td>
        <td class="px-4 py-2 border">${fee.description || "N/A"}</td>
        <td class="px-4 py-2 border">${fee.created_at || "N/A"}</td>
      `;
      feesTableBody.appendChild(row);
    });
  }
}

// Show error message
function showError(message) {
  $("loading").style.display = "none";
  $("profileContent").style.display = "none";
  $("error").style.display = "block";
  $("error").textContent = message;
}