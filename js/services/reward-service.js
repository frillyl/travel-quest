import { getState, saveState } from "./storage.js";

export function completeQuest(quest) {
    const state = getState();
    const alreadyCompleted = state.completedQuests.includes(quest.id);

    if (alreadyCompleted) {
        return {
            state,
            isNewCompletion: false,
            xpEarned: 0,
            badgeUnlocked: false
        };
    }

    state.completedQuests.push(quest.id);
    state.xp += quest.xp;

    let badgeUnlocked = false;

    if (
        quest.badge && !state.badges.includes(quest.badge.id)
    ) {
        state.badges.push(quest.badge.id);

        badgeUnlocked = true;
    }

    saveState(state);

    return {
        state,
        isNewCompletion: true,
        xpEarned: quest.xp,
        badgeUnlocked
    };
}