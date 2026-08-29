import { getState, saveState} from "./storage.js";
import { XP_CONFIG } from "../config/xp-config.js";

export function completeTaskReward(taskId) {
    const state = getState();

    if (!taskId) {
        return {
            state,
            isNewCompletion: false,
            xpEarned: 0
        };
    }

    const alreadyCompleted = state.completedTasks.includes(taskId);

    if (alreadyCompleted) {
        return {
            state,
            isNewCompletion: false,
            xpEarned: 0
        };
    }

    state.xp += XP_CONFIG.TASK_COMPLETION_XP;

    saveState(state);

    return {
        state,
        isNewCompletion: true,
        xpEarned: XP_CONFIG.TASK_COMPLETION_XP
    };
}

export function completeQuest(quest) {
    const state = getState();
    const alreadyCompleted = state.completedQuests.includes(quest.id);

    if (alreadyCompleted) {
        return {
            state,
            isNewCompletion: false,
            xpEarned: 0,
            bonusXP: 0,
            badgeUnlocked: false
        };
    }

    state.completedQuests.push(quest.id);

    const bonusXP = XP_CONFIG.QUEST_COMPLETION_BONUS_XP;

    state.xp += bonusXP;

    let badgeUnlocked = false;

    if (quest.badge && !state.badges.includes(quest.badge.id)) {
        state.badges.push(quest.badge.id);
        badgeUnlocked = true;
    }

    saveState(state);

    return {
        state,
        isNewCompletion: true,
        xpEarned: bonusXP,
        bonusXP,
        badgeUnlocked
    };
}