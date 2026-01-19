import { apiGetOne } from "../services/studentService.js";
import { $ } from "../utils/dom.js";

// Initialize the profile controller
export function initProfileController() {
  console.log("CONTROLLER: profile controller initialized");

  // Get the student ID from the URL query parameters
  const urlParams = new URLSearchParams(window.location.search);
  const studentId = urlParams.get('id');

  if (!studentId) {
    showError("No student ID provided");
    return;
  }

  loadStudentProfile(studentId);
}

// Load and display the student profile
async function loadStudentProfile(id) {
  try {
    const student = await apiGetOne(id);

    if (student) {
      displayProfile(student);
    } else {
      showError("Student not found");
    }
  } catch (error) {
    console.error("Error loading student profile:", error);
    showError("Error loading profile");
  }
}

// Display the student profile
function displayProfile(student) {
  // Hide loading and error messages
  $("loading").style.display = "none";
  $("error").style.display = "none";

  // Show profile content
  $("profileContent").style.display = "block";

  // Populate the profile fields
  $("studentId").textContent = student.id;
  $("studentName").textContent = student.name;
  $("studentEmail").textContent = student.email;
  $("studentCourse").textContent = student.course;
  $("studentYear").textContent = student.year;
  $("studentCreatedAt").textContent = student.created_at || "N/A";
  $("studentUpdatedAt").textContent = student.updated_at || "N/A";
}

// Show error message
function showError(message) {
  // Hide loading and profile content
  $("loading").style.display = "none";
  $("profileContent").style.display = "none";

  // Show error message
  $("error").style.display = "block";
  $("error").textContent = message;
}
