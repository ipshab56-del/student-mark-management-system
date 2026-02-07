// Main entrypoint for frontend
import { router, initRouterEvents, updateActiveNavLink } from "./router/viewRouter.js";

// Initialize router and navigation events
document.addEventListener('DOMContentLoaded', () => {
  initRouterEvents();
  router();
  updateActiveNavLink();
});
