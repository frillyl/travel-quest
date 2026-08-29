import { getState } from "../services/storage.js";
import {
  getProgression
} from "../services/progression-service.js";

function formatXP(value) {
  return `${value.toLocaleString("en-US")} XP`;
}

function getElement(selector) {
  return document.querySelector(selector);
}

function renderLevel(progression) {
  const element =
    getElement("#player-level");

  if (!element) {
    return;
  }

  element.textContent =
    String(progression.level);
}

function renderXP(progression) {
  const element =
    getElement("#player-xp");

  if (!element) {
    return;
  }

  element.textContent =
    formatXP(progression.currentXP);
}

function renderNextLevel(progression) {
  const element =
    getElement("#next-level-xp");

  if (!element) {
    return;
  }

  element.textContent =
    formatXP(progression.nextLevelXP);
}

function renderProgressBar(progression) {
  const bar =
    getElement("#xp-progress-bar");

  const track =
    getElement("#xp-progress-track");

  if (!bar || !track) {
    return;
  }

  bar.style.width =
    `${progression.percentage}%`;

  track.setAttribute(
    "aria-valuenow",
    String(progression.percentage)
  );
}

function renderProgressText(progression) {
  const text =
    getElement("#xp-progress-text");

  const percentage =
    getElement(
      "#xp-progress-percentage"
    );

  if (text) {
    if (
      progression.xpRemaining === 0
    ) {
      text.textContent =
        "Maximum level reached";
    } else {
      text.textContent =
        `${formatXP(
          progression.xpRemaining
        )} remaining`;
    }
  }

  if (percentage) {
    percentage.textContent =
      `${progression.percentage}%`;
  }
}

export function renderDashboardProgression() {
  const state =
    getState();

  const progression =
    getProgression(
      state.xp
    );

  renderLevel(
    progression
  );

  renderXP(
    progression
  );

  renderNextLevel(
    progression
  );

  renderProgressBar(
    progression
  );

  renderProgressText(
    progression
  );
}

renderDashboardProgression();