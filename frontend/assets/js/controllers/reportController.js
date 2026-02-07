import { apiGetAll } from "../services/studentService.js";
import { apiMarkGetAll } from "../services/markService.js";
import { apiFeeGetAll } from "../services/feeService.js";
import { apiTeacherGetAll } from "../services/teacherService.js";
import { exportToCSV, exportToPDF, exportProfileToCSV, exportProfileToPDF } from "../utils/exportTools.js";

let allReportData = []; // Store all data for filtering
let filteredData = []; // Store currently filtered data

export function initReportController() {
  console.log("CONTROLLER: report controller initialized");
  loadReport();
  setupAdvancedSearch();
  setupExportButtons();
  setupSortDropdown();
}

function setupSearch() {
  const searchInput = document.getElementById("reportSearch");
  if (!searchInput) return;
  
  searchInput.addEventListener("input", debounce(() => {
    filterReportTable(searchInput.value.trim());
  }, 300));
}

function setupAdvancedSearch() {
  const searchInput = document.getElementById('reportSearch');
  const clearFilters = document.getElementById('clearFilters');

  const applyFilters = debounce(() => {
    applyAdvancedFilters();
  }, 300);

  if (searchInput) searchInput.addEventListener('input', applyFilters);

  if (clearFilters) {
    clearFilters.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      document.getElementById('sortBy').value = '';
      applyAdvancedFilters();
    });
  }
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

  tbody.innerHTML = '<tr><td colspan="10">Loading report data...</td></tr>';

  try {
    const [students, marks, fees, teachers] = await Promise.all([
      apiGetAll(),
      apiMarkGetAll(),
      apiFeeGetAll(),
      apiTeacherGetAll(),
    ]);

    // Clear and store data
    allReportData = [];
    tbody.innerHTML = "";

    if (students.length === 0) {
      tbody.innerHTML = '<tr><td colspan="10">No student data found</td></tr>';
      return;
    }

    students.forEach((student) => {
      const studentMarks = marks.filter((m) => m.student_id === student.id);
      const studentFees = fees.filter((f) => f.student_id === student.id);
      
      // Get marks by subject
      const mathematicsMarks = studentMarks.find(m => m.subject === 'mathematics')?.marks || '-';
      const literatureMarks = studentMarks.find(m => m.subject === 'literature')?.marks || '-';
      const coreMarks = studentMarks.find(m => m.subject === 'core')?.marks || '-';

      // Calculate overall percentage
      let percentage = '-';
      const hasMathematics = mathematicsMarks !== '-';
      const hasLiterature = literatureMarks !== '-';
      const hasCore = coreMarks !== '-';
      
      if (hasMathematics && hasLiterature && hasCore) {
        const totalMarks = parseInt(mathematicsMarks) + parseInt(literatureMarks) + parseInt(coreMarks);
        const percentage_value = ((totalMarks / 300) * 100).toFixed(2);
        percentage = percentage_value + '%';
      }

      // Calculate total fees
      const totalFees = studentFees.reduce((sum, fee) => sum + parseFloat(fee.amount || 0), 0);
      const pendingFees = studentFees.filter(f => f.status === 'pending').reduce((sum, fee) => sum + parseFloat(fee.amount || 0), 0);

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
        totalFees: totalFees,
        pendingFees: pendingFees,
        studentData: student,
        marksData: studentMarks,
        feesData: studentFees,
        element: null
      };

      const row = document.createElement("tr");
      row.style.cursor = "pointer";
      row.innerHTML = `
        <td>${student.id}</td>
        <td>${student.name}</td>
        <td>${student.email}</td>
        <td>${student.course}</td>
        <td>${student.year}</td>
        <td>${mathematicsMarks}</td>
        <td>${literatureMarks}</td>
        <td>${coreMarks}</td>
        <td>${percentage}</td>
        <td style="text-align: center;">Click to View</td>
      `;
      
      // Add click event to show profile modal
      row.addEventListener('click', () => {
        showStudentProfile(rowData);
      });
      
      rowData.element = row;
      allReportData.push(rowData);
      tbody.appendChild(row);
    });

    filteredData = [...allReportData];
    updateResultsCount();
  } catch (error) {
    console.error("Error loading report data:", error);
    tbody.innerHTML = '<tr><td colspan="10">Error loading report data. Please try again.</td></tr>';
  }
}

function showStudentProfile(data) {
  const modal = document.getElementById('profileModal');
  const modalContent = document.getElementById('modalProfileContent');
  
  modalContent.innerHTML = `
    <div style="max-width: 1200px; margin: 0 auto; padding: 20px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h1 style="font-size: 2em; margin: 0;">${data.studentData.name}</h1>
        <div style="display: flex; gap: 10px;">
          <button id="exportProfileCSV" style="padding: 8px 16px;">Export CSV</button>
          <button id="exportProfilePDF" style="padding: 8px 16px;">Export PDF</button>
        </div>
      </div>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
        <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px;">
          <h3 style="margin-bottom: 10px; color: #FFD700;">Personal Info</h3>
          <p style="margin: 5px 0;"><strong>ID:</strong> ${data.studentData.id}</p>
          <p style="margin: 5px 0;"><strong>Email:</strong> ${data.studentData.email}</p>
          <p style="margin: 5px 0;"><strong>Course:</strong> ${data.studentData.course}</p>
          <p style="margin: 5px 0;"><strong>Year:</strong> ${data.studentData.year}</p>
        </div>
        
        <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px;">
          <h3 style="margin-bottom: 10px; color: #FFD700;">Academic Performance</h3>
          <p style="margin: 5px 0;"><strong>Mathematics:</strong> ${data.mathematics}/100</p>
          <p style="margin: 5px 0;"><strong>Literature:</strong> ${data.literature}/100</p>
          <p style="margin: 5px 0;"><strong>Core:</strong> ${data.core}/100</p>
          <p style="margin: 5px 0; color: #FFD700;"><strong>Overall:</strong> ${data.percentage}</p>
        </div>
      </div>
      
      <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 20px;">
        <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px;">
          <h3 style="margin-bottom: 10px; color: #FFD700;">Fee Summary</h3>
          <p style="margin: 5px 0;"><strong>Total:</strong> $${data.totalFees.toFixed(2)}</p>
          <p style="margin: 5px 0;"><strong>Pending:</strong> $${data.pendingFees.toFixed(2)}</p>
          <p style="margin: 5px 0; color: ${data.pendingFees > 0 ? '#ff6b6b' : '#51cf66'};"><strong>Status:</strong> ${data.pendingFees > 0 ? 'Outstanding' : 'Paid'}</p>
        </div>
        
        <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px;">
          <h3 style="margin-bottom: 10px; color: #FFD700;">Fee Records</h3>
          ${data.feesData.length === 0 ? 
            '<p>No fee records available</p>' : 
            `<table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <thead>
                <tr>
                  <th style="padding: 8px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.3); color: #FFD700;">Amount</th>
                  <th style="padding: 8px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.3); color: #FFD700;">Due Date</th>
                  <th style="padding: 8px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.3); color: #FFD700;">Status</th>
                  <th style="padding: 8px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.3); color: #FFD700;">Description</th>
                </tr>
              </thead>
              <tbody>
                ${data.feesData.map(fee => `
                  <tr>
                    <td style="padding: 6px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.2);">$${fee.amount}</td>
                    <td style="padding: 6px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.2);">${fee.due_date}</td>
                    <td style="padding: 6px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.2); color: ${fee.status === 'paid' ? '#51cf66' : fee.status === 'overdue' ? '#ff6b6b' : '#ffd43b'}">${fee.status}</td>
                    <td style="padding: 6px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.2);">${fee.description || 'N/A'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>`
          }
        </div>
      </div>
    </div>
  `;
  
  modal.style.display = 'block';
  
  // Add close functionality
  const closeBtn = modal.querySelector('.close');
  if (closeBtn) {
    closeBtn.onclick = function() {
      modal.style.display = 'none';
    };
  }
  
  // Add export functionality for profile
  const profileCSVBtn = modal.querySelector('#exportProfileCSV');
  const profilePDFBtn = modal.querySelector('#exportProfilePDF');
  
  if (profileCSVBtn) {
    profileCSVBtn.onclick = () => {
      const config = {
        studentFields: [
          {key: 'id', label: 'Student ID'},
          {key: 'name', label: 'Name'},
          {key: 'email', label: 'Email'},
          {key: 'course', label: 'Course'},
          {key: 'year', label: 'Year'}
        ],
        rowColumns: [
          {key: 'amount', label: 'Amount'},
          {key: 'due_date', label: 'Due Date'},
          {key: 'status', label: 'Status'},
          {key: 'description', label: 'Description'}
        ]
      };
      exportProfileToCSV(`${data.studentData.name}-profile.csv`, data.studentData, data.feesData, config);
    };
  }
  
  if (profilePDFBtn) {
    profilePDFBtn.onclick = () => {
      const config = {
        studentFields: [
          {key: 'id', label: 'Student ID'},
          {key: 'name', label: 'Name'},
          {key: 'email', label: 'Email'},
          {key: 'course', label: 'Course'},
          {key: 'year', label: 'Year'}
        ],
        rowColumns: [
          {key: 'amount', label: 'Amount'},
          {key: 'due_date', label: 'Due Date'},
          {key: 'status', label: 'Status'},
          {key: 'description', label: 'Description'}
        ]
      };
      exportProfileToPDF(`${data.studentData.name} - Student Profile`, data.studentData, data.feesData, config);
    };
  }
  
  // Close when clicking outside content
  modal.onclick = function(event) {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  };
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
        <td colspan="10">
          No results found for "${searchTerm}"
        </td>
      </tr>
    `;
  }
}

function setupExportButtons() {
  const csvBtn = document.getElementById('exportReportCSV');
  const pdfBtn = document.getElementById('exportReportPDF');
  
  if (csvBtn) {
    csvBtn.onclick = () => {
      const columns = [
        {key: 'id', label: 'Student ID'},
        {key: 'name', label: 'Name'},
        {key: 'email', label: 'Email'},
        {key: 'course', label: 'Course'},
        {key: 'year', label: 'Year'},
        {key: 'mathematics', label: 'Mathematics'},
        {key: 'literature', label: 'Literature'},
        {key: 'core', label: 'Core'},
        {key: 'percentage', label: 'Overall %'}
      ];
      exportToCSV('student-reports.csv', filteredData, columns);
    };
  }
  
  if (pdfBtn) {
    pdfBtn.onclick = () => {
      const tableHTML = `
        <table>
          <thead>
            <tr>
              <th>ID</th><th>Name</th><th>Email</th><th>Course</th><th>Year</th>
              <th>Math</th><th>Literature</th><th>Core</th><th>Overall %</th>
            </tr>
          </thead>
          <tbody>
            ${filteredData.map(data => `
              <tr>
                <td>${data.id}</td><td>${data.name}</td><td>${data.email}</td>
                <td>${data.course}</td><td>${data.year}</td><td>${data.mathematics}</td>
                <td>${data.literature}</td><td>${data.core}</td><td>${data.percentage}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
      exportToPDF('Student Reports', tableHTML);
    };
  }
}

function setupSortDropdown() {
  const sortSelect = document.getElementById('sortBy');
  if (!sortSelect) return;
  
  sortSelect.addEventListener('change', () => {
    const sortValue = sortSelect.value;
    if (!sortValue) {
      renderTable(filteredData);
      return;
    }
    
    const [sortBy, direction] = sortValue.split('-');
    
    const sortedData = [...filteredData].sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      
      if (sortBy === 'id' || sortBy === 'year') {
        aVal = parseInt(aVal) || 0;
        bVal = parseInt(bVal) || 0;
      } else if (sortBy === 'percentage') {
        aVal = aVal === '-' ? -1 : parseFloat(aVal.replace('%', '')) || 0;
        bVal = bVal === '-' ? -1 : parseFloat(bVal.replace('%', '')) || 0;
      } else {
        aVal = String(aVal).toLowerCase();
        bVal = String(bVal).toLowerCase();
      }
      
      const result = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return direction === 'desc' ? -result : result;
    });
    
    renderTable(sortedData);
  });
}

function renderTable(data) {
  const tbody = document.getElementById('reportTableBody');
  tbody.innerHTML = '';
  data.forEach(item => {
    tbody.appendChild(item.element);
  });
  updateResultsCount();
}

function populateFilterDropdowns() {
  const courseFilter = document.getElementById('courseFilter');
  const yearFilter = document.getElementById('yearFilter');

  if (courseFilter) {
    const courses = [...new Set(allReportData.map(item => item.course))].sort();
    courseFilter.innerHTML = '<option value="" disabled selected>Select Course</option>';
    courses.forEach(course => {
      courseFilter.innerHTML += `<option value="${course}">${course}</option>`;
    });
  }

  if (yearFilter) {
    const years = [...new Set(allReportData.map(item => item.year))].sort();
    yearFilter.innerHTML = '<option value="" disabled selected>Select Year</option>';
    years.forEach(year => {
      yearFilter.innerHTML += `<option value="${year}">${year}</option>`;
    });
  }
}



function applyAdvancedFilters() {
  const searchTerm = document.getElementById('reportSearch')?.value.toLowerCase() || '';

  filteredData = allReportData.filter(data => {
    // Text search
    const matchesSearch = !searchTerm ||
      data.name.toLowerCase().includes(searchTerm) ||
      data.id.toString().includes(searchTerm) ||
      data.email.toLowerCase().includes(searchTerm);

    return matchesSearch;
  });

  renderTable(filteredData);
}

function updateResultsCount() {
  const countElement = document.getElementById('resultsCount');
  if (countElement) {
    const total = allReportData.length;
    const filtered = filteredData.length;
    countElement.textContent = filtered === total ? 
      `Showing ${total} students` : 
      `Showing ${filtered} of ${total} students`;
  }
}