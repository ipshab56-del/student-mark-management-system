import { initStudentController } from "../controllers/studentController.js";
import { initTeacherController } from "../controllers/teacherController.js";

// Load a view into #app container
async function loadView(path) {
  const html = await fetch(path).then(res => res.text());
  document.querySelector("#app").innerHTML = html;
}

// Handle page routing based on the URL
export async function router() {
  console.log("ROUTER: page =", window.location.pathname);
  const path = window.location.pathname;

  if (path === "/" || path === "/home") {
    await loadView("/frontend/pages/home.html");
  }

  else if (path === "/students") {
    await loadView("/frontend/pages/students.html");
    initStudentController();  // <-- runs controller after rendering page
  }

  else if (path === "/teachers") {
    await loadView("/frontend/pages/teachers.html");
    initTeacherController();
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

// 🚀 Load the correct route when the page initially loads
window.addEventListener("DOMContentLoaded", () => {
  initRouterEvents();  // enable SPA navigation
  router();            // load correct page immediately
});
