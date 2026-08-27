import { renderDashboard } from "./pages/dashboard.js";

const app = document.querySelector("#app");

if (!app) {
    throw new Error(
        "Application root element (#app) was not found."
    );
}

renderDashboard(app);