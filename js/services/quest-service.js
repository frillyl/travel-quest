import { quests } from "../data/quests.js";
import { getState, saveState } from "./storage.js";

export function getQuestById(questId) {
    return quests.find(quest => quest.id === questId) ?? null;
}

export function getQuestsByCity(cityId) {
    if (!cityId || cityId === "all") {
        return quests;
    }

    return quests.filter(
        quest => quest.cityId === cityId
    );
}

export function getQuestsByCategory(category) {
    if (!category || category === "all") {
        return quests;
    }

    return quests.filter(
        quest => quest.category === category
    );
}

export function filterQuests({
    cityId = "all",
    category = "all"
} = {}) {
    return quests.filter(quest => {
        const matchesCity = cityId === "all" || quest.cityId === cityId;
        const matchesCategory = category === "all" || quest.category === category;

        return matchesCity && matchesCategory;
    });
}

export function isTaskCompleted(taskId) {
    const state = getState();

    return state.completedTasks.includes(taskId);
}

export function completeTask(taskId) {
    const state = getState();

    if (state.completedTasks.includes(taskId)) {
        return state;
    }

    state.completedTasks.push(taskId);
    saveState(state);

    return state;
}

export function isQuestCompleted(questId) {
    const state = getState();

    return state.completedQuests.includes(questId);
}

export function getQuestProgress(quest) {
    const state = getState();
    const completedTasks = quest.tasks.filter(task => state.completedTasks.includes(task.id)).length;
    const totalTasks = quest.tasks.length;
    const percentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    return {
        completedTasks,
        totalTasks,
        percentage,
        isCompleted: totalTasks > 0 && completedTasks === totalTasks
    };
}