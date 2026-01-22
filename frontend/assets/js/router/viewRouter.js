import { initStudentController } from "../controllers/studentController.js";
import { initTeacherController } from "../controllers/teacherController.js";
import { initMarkController } from "../controllers/markController.js";
import { FeeController } from "../controllers/feeController.js";
import { initReportController } from "../controllers/reportController.js";
import { initProfileController } from "../controllers/profileController.js";

// Load a view into #app container
async function loadView(path) {
  try {
    const html = await fetch(path).then(res => res.text());
    const appContainer = document.querySelector("#app");
    if (appContainer) {
      appContainer.innerHTML = html;
    }
  } catch (error) {
    console.error('Error loading view:', error);
    document.querySelector("#app").innerHTML = '<h1>Error loading page</h1>';
  }
}

// Handle page routing based on the URL
export async function router() {
  const path = window.location.pathname;

  if (path === "/" || path === "/home") {
    await loadView("/frontend/pages/home.html");
  }

  else if (path === "/students") {
    await loadView("/frontend/pages/students.html");
    // Wait for DOM to be ready before initializing controller
    setTimeout(() => initStudentController(), 0);
  }

  else if (path === "/teachers") {
    await loadView("/frontend/pages/teachers.html");
    // Wait for DOM to be ready before initializing controller
    setTimeout(() => initTeacherController(), 0);
  }

  else if (path === "/marks") {
    await loadView("/frontend/pages/marks.html");
    setTimeout(() => initMarkController(), 0);
  }

  else if (path === "/fees") {
    await loadView("/frontend/pages/fees.html");
    setTimeout(async () => {
      const feeController = new FeeController();
      await feeController.init();
      window.feeController = feeController;
    }, 0);
  }

  else if (path === "/reports") {
    await loadView("/frontend/pages/reports.html");
    setTimeout(() => initReportController(), 0);
  }

  else if (path === "/profile") {
    console.log("=== Router: Loading profile page");
    await loadView("/frontend/pages/profile.html");
    // Wait for DOM to be ready before initializing profile controller
    // Use a longer timeout to ensure query parameters are available
    setTimeout(() => {
      console.log("=== Router: Loading profile, URL:", window.location.href);
      console.log("=== Router: About to call initProfileController");
      initProfileController();
    }, 100);
  }

  else {
    await loadView("/frontend/pages/404.html");
  }
}

// Allow SPA navigation without full page reload
export function initRouterEvents() {
  document.addEventListener("click", (e) => {
    const link = e.target.closest("[data-link]"); // supports nested elements
    if (link) {
      e.preventDefault();
      history.pushState(null, "", link.href);
      router();
    }
  });

  // Back/forward browser navigation
  window.addEventListener("popstate", router);
}


