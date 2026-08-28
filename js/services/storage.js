const STORAGE_KEY = "travelQuest";

const DEFAULT_STATE = {
    xp: 0,
    completedQuests: [],
    completedTasks: [],
    badges: [],
    redeemedRewards: []
};

function createDefaultState() {
    return structuredClone(DEFAULT_STATE);
}

function normalizeState(state) {
    return {
        ...createDefaultState(),
        ...state,
        xp:
        Number.isFinite(state.xp) && state.xp >= 0 ? state.xp : 0,

        completedQuests:
            Array.isArray(state.completedQuests) ? state.completedQuests : [],

        completedTasks:
            Array.isArray(state.completedTasks) ? state.completedTasks : [],

        badges:
            Array.isArray(state.badges) ? state.badges : [],

        redeemedRewards:
            Array.isArray(state.redeemedRewards) ? state.redeemedRewards : []
    };
}

export function getState() {
    const rawState = localStorage.getItem(STORAGE_KEY);

    if (!rawState) {
        return createDefaultState();
    }

    try {
        const parsedState = JSON.parse(rawState);

        return normalizeState(parsedState);
    } catch (error) {
        console.error("Failed to parse Travel Quest state:", error);

        return createDefaultState();
    }
}

export function saveState(state) {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(normalizeState(state))
    );
}

export function resetState() {
    localStorage.removeItem(STORAGE_KEY);
}