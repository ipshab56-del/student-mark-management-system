import { initStudentController } from "../controllers/studentController.js";
import { initTeacherController } from "../controllers/teacherController.js";
import { initMarkController } from "../controllers/markController.js";

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


