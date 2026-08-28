import { quests } from "../data/quests.js";
import { cities } from "../data/cities.js";
import { getState } from "./storage.js";

function uniqueById(items) {
    const map = new Map();

    items.forEach(item => {
        if (!map.has(item.id)) {
            map.set(item.id, item);
        }
    });

    return Array.from(map.values());
}

export function getAllBadges() {
    const badges = quests.filter(quest => quest.badge).map(quest => ({
            ...quest.badge,
            questId: quest.id,
            cityId: quest.cityId,
            category: quest.category
        }));

    return uniqueById(badges);
}

export function getBadgeById(badgeId) {
    return (getAllBadges().find(badge => badge.id === badgeId) ?? null);
}

export function isBadgeUnlocked(badgeId) {
    const state = getState();

    return state.badges.includes(badgeId);
}

export function getBadgeProgress() {
    const badges = getAllBadges();
    const state = getState();
    const unlockedBadges = badges.filter(badge => state.badges.includes(badge.id));

    return {
        total: badges.length,
        unlocked: unlockedBadges.length,
        locked:
        badges.length -
        unlockedBadges.length,
        percentage:
        badges.length === 0 ? 0 : Math.round((unlockedBadges.length / badges.length) * 100)
    };
}

export function getBadgesWithStatus() {
    const badges = getAllBadges();
    const state = getState();

    return badges.map(badge => ({
        ...badge,
        unlocked: state.badges.includes(badge.id)
    }));
}

export function getCityName(cityId) {
    return (cities.find(city => city.id === cityId)?.name ?? "Unknown City");
}