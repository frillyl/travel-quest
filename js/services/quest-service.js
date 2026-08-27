import { quests } from "../data/quests.js";

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