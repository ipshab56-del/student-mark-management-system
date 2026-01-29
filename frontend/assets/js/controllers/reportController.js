import { apiGetAll } from "../services/studentService.js";
import { apiMarkGetAll } from "../services/markService.js";
import { apiTeacherGetAll } from "../services/teacherService.js";

let allReportData = []; // Store all data for filtering

export function initReportController() {
  console.log("CONTROLLER: report controller initialized");
  loadReport();
  setupSearch();
}

function setupSearch() {
  const searchInput = document.getElementById("reportSearch");
  if (!searchInput) return;
  
  searchInput.addEventListener("input", debounce(() => {
    filterReportTable(searchInput.value.trim());
  }, 300));
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

async function loadReport() {
  const tbody = document.getElementById("reportTableBody");
  if (!tbody) return;

  tbody.innerHTML = '<tr><td colspan="9" class="text-center">Loading report data...</td></tr>';

  try {
    const [students, marks, teachers] = await Promise.all([
      apiGetAll(),
      apiMarkGetAll(),
      apiTeacherGetAll(),
    ]);

    // Clear and store data
    allReportData = [];
    tbody.innerHTML = "";

    if (students.length === 0) {
      tbody.innerHTML = '<tr><td colspan="9" class="text-center">No student data found</td></tr>';
      return;
    }

    students.forEach((student) => {
      const studentMarks = marks.filter((m) => m.student_id === student.id);
      
      // Get marks by subject
      const mathematicsMarks = studentMarks.find(m => m.subject === 'mathematics')?.marks || '-';
      const literatureMarks = studentMarks.find(m => m.subject === 'literature')?.marks || '-';
      const coreMarks = studentMarks.find(m => m.subject === 'core')?.marks || '-';

      // Calculate overall percentage - only if ALL three subjects have marks
      let percentage = '-';
      
      // Check if all three subjects have marks
      const hasMathematics = mathematicsMarks !== '-';
      const hasLiterature = literatureMarks !== '-';
      const hasCore = coreMarks !== '-';
      
      if (hasMathematics && hasLiterature && hasCore) {
        // All three marks exist - calculate percentage
        const totalMarks = parseInt(mathematicsMarks) + parseInt(literatureMarks) + parseInt(coreMarks);
        const percentage_value = ((totalMarks / 300) * 100).toFixed(2);
        percentage = percentage_value + '%';
      }

      const rowData = {
        id: student.id,
        name: student.name,
        email: student.email,
        course: student.course,
        year: student.year,
        mathematics: mathematicsMarks,
        literature: literatureMarks,
        core: coreMarks,
        percentage: percentage,
        element: null
      };

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${student.id}</td>
        <td>${student.name}</td>
        <td>${student.email}</td>
        <td>${student.course}</td>
        <td>${student.year}</td>
        <td class="font-semibold">${mathematicsMarks}</td>
        <td class="font-semibold">${literatureMarks}</td>
        <td class="font-semibold">${coreMarks}</td>
        <td class="font-bold text-blue-600">${percentage}</td>
      `;
      
      rowData.element = row;
      allReportData.push(rowData);
      tbody.appendChild(row);
    });
  } catch (error) {
    console.error("Error loading report data:", error);
    tbody.innerHTML = '<tr><td colspan="9" class="text-center text-red">Error loading report data. Please try again.</td></tr>';
  }
}

function filterReportTable(searchTerm) {
  const tbody = document.getElementById("reportTableBody");
  if (!tbody || allReportData.length === 0) return;

  if (!searchTerm) {
    // Show all rows if search is empty
    allReportData.forEach(data => {
      if (data.element.parentNode !== tbody) {
        tbody.appendChild(data.element);
      }
    });
    return;
  }

  const lowerSearchTerm = searchTerm.toLowerCase();
  let hasMatches = false;
  
  // Clear table first
  tbody.innerHTML = "";
  
  // Filter and append matching rows
  allReportData.forEach(data => {
    const matches = 
      data.id.toString().includes(lowerSearchTerm) ||
      data.name.toLowerCase().includes(lowerSearchTerm) ||
      data.email.toLowerCase().includes(lowerSearchTerm) ||
      data.course.toLowerCase().includes(lowerSearchTerm) ||
      data.year.toString().includes(lowerSearchTerm);
    
    if (matches) {
      tbody.appendChild(data.element);
      hasMatches = true;
    }
  });
  
  // Show no results message if no matches
  if (!hasMatches) {
    tbody.innerHTML = `
      <tr>
        <td colspan="9" class="no-results">
          No results found for "${searchTerm}"
        </td>
      </tr>
    `;
  }
}