import { cities } from "../data/cities.js";
import { getQuestById, getQuestProgress, completeTask } from "../services/quest-service.js";
import { completeTaskReward, completeQuest } from "../services/reward-service.js";
import { getState } from "../services/storage.js";
import { XP_CONFIG } from "../config/xp-config.js";

function escapeHTML(value) {
    const div = document.createElement("div");

    div.textContent = String(value);

    return div.innerHTML;
}

function capitalize(value) {
    return value.replace(/\b\w/g, character => character.toUpperCase());
}

function getCityName(cityId) {
    return (
        cities.find(city => city.id === cityId)?.name ?? "Unknown City"
    );
}

function renderTask(task, state) {
    const isCompleted = state.completedTasks.includes(task.id);

    return `
        <li class="task-item ${isCompleted ? "completed" : ""}">
            <button class="task-button" type="button" data-task-id="${escapeHTML(task.id)}" ${isCompleted ? "disabled" : ""} aria-label="${isCompleted ? `${escapeHTML(task.title)} completed` : `Complete ${escapeHTML(task.title)}`}">
                <span class="task-check" aria-hidden="true">
                    ${isCompleted ? "✓" : ""}
                </span>
            </button>

            <div class="task-content">
                <span class="task-number">Task</span>
                <h3 class="task-title">
                    ${escapeHTML(task.title)}
                </h3>
            </div>

            ${
                isCompleted
                    ? `
                        <span class="task-completed-label">
                            Completed
                        </span>
                    ` : ""
            }

            <span class="task-xp">
                +${XP_CONFIG.TASK_COMPLETION_XP} XP
            </span>
        </li>
    `;
}

function renderProgress(progress) {
    return `
        <div class="progress-header">
            <span>Progress</span>
            <strong>
                ${progress.completedTasks} / ${progress.totalTasks}
            </strong>
        </div>

        <div class="progress-track" role="progressbar" aria-valuemin="0" aria-valuemax="${progress.totalTasks}" aria-valuenow="${progress.completedTasks}" aria-label="Quest progress">
            <div class="progress-bar" style="width: ${progress.percentage}%"></div>
        </div>

        <p class="progress-percentage">
            ${progress.percentage}% complete
        </p>
    `;
}

function renderCompletionScreen(container, quest, result) {
    const cityName = getCityName(quest.cityId);
    const rewardMessage = result.isNewCompletion ? `You completed the ${cityName} quest and earned your rewards.` : "This quest has already been completed.";

    container.innerHTML = `
        <main class="quest-completion">
            <div class="container">
                <section class="completion-card" aria-labelledby="completion-title">
                    <div class="completion-icon" aria-hidden="true">
                        ✓
                    </div>

                    <p class="completion-eyebrow">Quest Complete</p>
                    <h1 id="completion-title" class="completion-title">
                        ${escapeHTML(quest.title)}
                    </h1>
                    <p class="completion-description">
                        ${escapeHTML(rewardMessage)}
                    </p>

                    ${result.isNewCompletion
                        ? `
                            <div class="reward-summary">
                                <div class="reward-item">
                                    <span class="reward-label">Task XP</span>
                                    <strong class="reward-value">
                                        +${quest.tasks.length * XP_CONFIG.TASK_COMPLETION_XP} XP
                                    </strong>
                                </div>

                                <div class="reward-item">
                                    <span class="reward-label">Quest Bonus</span>
                                    <strong class="reward-value">
                                        +${result.bonusXP} XP
                                    </strong>
                                </div>

                                <div class="reward-item">
                                    <span class="reward-label">Total XP Earned</span>
                                    <strong class="reward-value">
                                        +${
                                            (quest.tasks.length * XP_CONFIG.TASK_COMPLETION_XP) + result.bonusXP
                                        } XP
                                    </strong>
                                </div>
                            ` : ""
                    }

                    <div class="completion-actions">
                        <a class="quest-button" href="./index.html#quests">Back to Quests</a>
                        <a class="secondary-button" href="./index.html">View Dashboard</a>
                    </div>
                </section>
            </div>
        </main>
    `;
}

function renderAlreadyCompleted(container, quest) {
    const state = getState();

    container.innerHTML = `
        <main class="quest-completion">
            <div class="container">
                <section class="completion-card" aria-labelledby="completed-title">
                    <div class="completion-icon" aria-hidden="true">✓</div>

                    <p class="completion-eyebrow">Quest Completed</p>
                    <h1 id="completed-title" class="completion-title">
                        ${escapeHTML(quest.title)}
                    </h1>
                    <p class="completion-description">
                        You have already completed this quest.
                    </p>

                    <div class="reward-summary">
                        <div class="reward-item">
                            <span class="reward-label">Current XP</span>
                            <strong class="reward-value">
                                ${state.xp} XP
                            </strong>
                        </div>

                        ${quest.badge
                            ? `
                                <div class="reward-item">
                                    <span class="reward-label">Badge</span>
                                    <strong class="reward-value">
                                        ${escapeHTML(quest.badge.name)}
                                    </strong>
                                    </div>
                            ` : ""
                        }
                    </div>

                    <div class="completion-actions">
                        <a class="quest-button" href="./index.html#quests">Back to Quests</a>
                        <a class="secondary-button" href="./index.html">View Dashboard</a>
                    </div>
                </section>
            </div>
        </main>
    `;
}

function bindTaskEvents(container, quest) {
    const taskButtons = container.querySelectorAll("[data-task-id]");

    taskButtons.forEach(button => {
        button.addEventListener("click", () => {
            const taskId = button.dataset.taskId;

            if (!taskId) {
                return;
            }

            const state = getState();
            const alreadyCompleted = state.completedTasks.includes(taskId);

            if (alreadyCompleted) {
                return;
            }

            completeTaskReward(taskId);
            completeTask(taskId);

            const progress = getQuestProgress(quest);

            if (progress.isCompleted) {
                const result = completeQuest(quest);

                renderCompletionScreen(container, quest, result);

                return;
            }

            renderQuestDetail(container, quest.id);
        });
    });
}

function renderQuestNotFound(container) {
    container.innerHTML = `
        <main class="quest-detail">
            <div class="container">
                <section class="empty-state">
                    <h1 class="empty-state-title">Quest not found</h1>
                    <p class="empty-state-description">The quest you are looking for does not exist.</p>
                    <a class="quest-button" href="./index.html#quests">Back to Quests</a>
                </section>
            </div>
        </main>
    `;
}

export function renderQuestDetail(container, questId) {
    const quest = getQuestById(questId);

    if (!quest) {
        renderQuestNotFound(container);

        return;
    }

    const state = getState();
    const progress = getQuestProgress(quest);

    if (
        state.completedQuests.includes(quest.id)
    ) {
        renderAlreadyCompleted(container, quest);

        return;
    }

    const cityName = getCityName(quest.cityId);

    container.innerHTML = `
        <main class="quest-detail">
            <div class="container">
                <a class="back-link" href="./index.html#quests">← Back to Quests</a>
                <header class="quest-detail-header">
                    <div class="quest-detail-heading">
                        <span class="quest-category">
                            ${escapeHTML(capitalize(quest.category))}
                        </span>

                        <h1 class="quest-detail-title">
                            ${escapeHTML(quest.title)}
                        </h1>
                        <p class="quest-detail-description">
                            ${escapeHTML(quest.description)}
                        </p>

                        <div class="quest-detail-meta">
                            <span>
                                ${escapeHTML(cityName)}
                            </span>
                            <span>
                                ${quest.tasks.length} Tasks
                            </span>
                            <strong>
                                +${quest.tasks.length * XP_CONFIG.TASK_COMPLETION_XP} XP Tasks
                            </strong>
                            <strong>
                                +${XP_CONFIG.QUEST_COMPLETION_BONUS_XP} XP Bonus
                            </strong>
                        </div>
                    </div>
                </header>

                <section class="quest-progress-section" aria-labelledby="progress-title">
                    <h2 id="progress-title" class="sr-only">Quest Progress</h2>

                    ${renderProgress(progress)}
                </section>

                <section class="tasks-section" aria-labelledby="tasks-title">
                    <header class="section-header">
                        <div>
                            <h2 id="tasks-title" class="section-title">Quest Tasks</h2>
                            <p class="section-description">Complete every task to finish this quest.</p>
                        </div>
                    </header>

                    <ol class="task-list">
                        ${quest.tasks.map(task => renderTask(task, state)).join("")}
                    </ol>
                </section>
            </div>
        </main>
    `;

    bindTaskEvents(container, quest);
}