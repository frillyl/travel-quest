import { cities } from "../data/cities.js";
import { quests } from "../data/quests.js";
import { getState } from "../services/storage.js";

function escapeHTML(value) {
    const div = document.createElement("div");
    div.textContent = String(value);

    return div.innerHTML;
}

function formatNumber(value) {
    return new Intl.NumberFormat("en-US").format(value);
}

function getCityName(cityId) {
    return cities.find(city => city.id === cityId)?.name ?? "Unknown City";
}

function renderCityCard(city) {
    return `
        <article class="city-card">
            <img class="city-card-image" src="${escapeHTML(city.image)}" alt="Explore ${escapeHTML(city.name)}" loading="lazy">

            <div class="city-card-content">
                <h3 class="city-name">
                    ${escapeHTML(city.name)}
                </h3>
                <p class="city-description">
                    ${escapeHTML(city.description)}
                </p>
            </div>
        </article>
    `;
}

function renderQuestCard(quest) {
    const cityName = getCityName(quest.cityId);

    return `
        <article class="quest-card">
            <div class="quest-card-header">
                <div>
                    <span class="quest-category">
                        ${escapeHTML(quest.category)}
                    </span>

                    <h3 class="quest-title">
                        ${escapeHTML(quest.title)}
                    </h3>
                </div>
            </div>

            <p class="quest-description">
                ${escapeHTML(quest.description)}
            </p>

            <div class="quest-meta">
                <span class="quest-tasks">
                    ${quest.tasks.length} Tasks · ${escapeHTML(cityName)}
                </span>

                <span class="quest-xp">
                    +${formatNumber(quest.xp)} XP
                </span>
            </div>

            <button class="quest-button" type="button" data-quest-id="${escapeHTML(quest.id)}">
                Start Quest
            </button>
        </article>
    `;
}

export function renderDashboard(container) {
    const state = getState();
    const completedQuestCount = state.completedQuests.length;
    const badgeCount = state.badges.length;
    const activeQuestCount = quests.length - completedQuestCount;

    container.innerHTML = `
        <section id="dashboard" class="dashboard" aria-labelledby="dashboard-title">
            <div class="container">
                <header class="dashboard-hero">
                    <div>
                        <p class="eyebrow">Travel Quest</p>
                        <h1 id="dashboard-title" class="dashboard-title">Explore Indonesia. Complete quests. Earn rewards.</h1>
                        <p class="dashboard-description">Discover cities, complete travel challenges, collect XP, unlock badges, and redeem exclusive rewards.</p>
                    </div>

                    <aside class="xp-card" aria-label="Your XP">
                        <span class="xp-card-label">Your XP</span>

                        <div class="xp-card-value">
                            ${formatNumber(state.xp)}
                        </div>

                        <p class="xp-card-meta">Keep exploring to earn more.</p>
                    </aside>
                </header>

                <section class="stats-grid" aria-label="Your Travel Quest statistics">
                    <article class="stat-card">
                        <span class="stat-label">Total XP</span>

                        <div class="stat-value">
                            ${formatNumber(state.xp)}
                        </div>
                    </article>

                    <article class="stat-card">
                        <span class="stat-label">Badges</span>

                        <div class="stat-value">
                            ${badgeCount}
                        </div>
                    </article>

                    <article class="stat-card">
                        <span class="stat-label">Quests Completed</span>

                        <div class="stat-value">
                            ${completedQuestCount}
                            <span style="color: var(--color-text-muted); font-size: 14px; font-weight: 600;">
                                / ${quests.length}
                            </span>
                        </div>
                    </article>
                </section>

                <section class="dashboard-section" aria-labelledby="cities-title">
                    <header class="section-header">
                        <div>
                            <h2 id="cities-title" class="section-title">Explore Cities</h2>
                            <p class="section-description">Choose a destination and start your journey.</p>
                        </div>
                    </header>

                    <div class="city-grid">
                        ${cities.map(renderCityCard).join("")}
                    </div>
                </section>

                <section id="quests" class="dashboard-section" aria-labelledby="quests-title">
                    <header class="section-header">
                        <div>
                            <h2 id="quests-title" class="section-title">Featured Quests</h2>
                            <p class="section-description">Complete quests to earn XP and unlock badges.</p>
                        </div>
                    </header>

                    <div class="quest-grid">
                        ${quests.slice(0, 4).map(renderQuestCard).join("")}
                    </div>
                </section>
            </div>
        </section>
    `;

    bindDashboardEvents(container);
}

function bindDashboardEvents(container) {
    const questButtons =
        container.querySelectorAll("[data-quest-id]");

        questButtons.forEach(button => {
            button.addEventListener("click", () => {
            const questId = button.dataset.questId;

            console.log("Start quest:", questId);

            // Router/quest detail
            });
        });
}