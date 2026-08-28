import { renderDashboard } from "./pages/dashboard.js";
import { renderQuestDetail } from "./pages/quest-detail.js";

const app = document.querySelector("#app");

if (!app) {
  throw new Error(
    "Application root element (#app) was not found."
  );
}

const params =
  new URLSearchParams(window.location.search);

const questId =
  params.get("quest");

if (questId) {
  renderQuestDetail(
    app,
    questId
  );
} else {
  renderDashboard(app);
}