import { getBadgesWithStatus, getBadgeProgress, getCityName } from "../services/badge-service.js";

function escapeHTML(value) {
    const div = document.createElement("div");

    div.textContent = String(value);

    return div.innerHTML;
}

function capitalize(value) {
    return value.replace(/\b\w/g, character => character.toUpperCase());
}

function getBadgeIcon(unlocked) {
    return unlocked ? "✓" : "🔒";
}

function renderBadgeCard(badge) {
    const statusText = badge.unlocked ? "Unlocked" : "Locked";
    const statusClass = badge.unlocked ? "badge-card--unlocked" : "badge-card--locked";
    const icon = getBadgeIcon(badge.unlocked);

    return `
        <article class="badge-card ${statusClass}" data-badge-id="${escapeHTML(badge.id)}">
            <div class="badge-card-icon" aria-hidden="true">
                ${icon}
            </div>

            <div class="badge-card-content">
                <span class="badge-status">
                    ${statusText}
                </span>
                <h3 class="badge-card-title">
                    ${escapeHTML(badge.name)}
                </h3>
                <p class="badge-card-description">
                    ${escapeHTML(badge.description)}
                </p>

                <div class="badge-card-meta">
                    <span>
                        ${escapeHTML(getCityName(badge.cityId))}
                    </span>
                    <span>
                        ${escapeHTML(capitalize(badge.category))}
                    </span>
                </div>
            </div>
        </article>
    `;
}

function renderProgress() {
    const progress = getBadgeProgress();
    const countElement = document.querySelector("#badge-progress-count");
    const barElement = document.querySelector("#badge-progress-bar");
    const wrapperElement = document.querySelector("#badge-progress-bar-wrapper");
    const descriptionElement = document.querySelector("#badge-progress-description");

    if (!countElement || !barElement || !wrapperElement || !descriptionElement) {
        return;
    }

    countElement.textContent = `${progress.unlocked} / ${progress.total}`;
    barElement.style.width = `${progress.percentage}%`;
    wrapperElement.setAttribute("aria-valuenow", String(progress.percentage));

    if (progress.total === 0) {
        descriptionElement.textContent = "No badges are available yet.";
        return;
    }

    if (progress.unlocked === progress.total) {
        descriptionElement.textContent = "You have unlocked every available badge.";
        return;
    }

    const remaining = progress.locked;

    descriptionElement.textContent = `${remaining} badge${
        remaining === 1 ? "" : "s"
    } remaining to complete your collection.`;
}

function renderFilterSummary(badges) {
    const element = document.querySelector("#badge-filter-summary");

    if (!element) {
        return;
    }

    const unlocked = badges.filter(badge => badge.unlocked).length;
    const locked = badges.length - unlocked;

    element.innerHTML = `
        <span>
            ${unlocked} Unlocked
        </span>
        <span>
            ${locked} Locked
        </span>
    `;
}

function renderBadges() {
    const grid = document.querySelector("#badge-grid");

    if (!grid) {
        return;
    }

    const badges = getBadgesWithStatus();

    if (badges.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <h2 class="empty-state-title">No badges available</h2>
                <p class="empty-state-description">Complete quests to start building your badge collection.</p>
            </div>
        `;

        return;
    }

    grid.innerHTML = badges.map(badge => renderBadgeCard(badge)).join("");

    renderFilterSummary(badges);
}

function init() {
    renderProgress();
    renderBadges();
}

init();