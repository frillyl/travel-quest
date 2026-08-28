const STORAGE_KEY = "travelQuest";

const DEFAULT_STATE = {
    xp: 0,
    completedQuests: [],
    completedTasks: [],
    badges: [],
    redeemedRewards: []
};

export function getState() {
    const rawState = localStorage.getItem(STORAGE_KEY);

    if (!rawState) {
        return structuredClone(DEFAULT_STATE);
    }

    try {
        const parsedState = JSON.parse(rawState);

        return {
        ...structuredClone(DEFAULT_STATE),
        ...parsedState
        };
    } catch {
        return structuredClone(DEFAULT_STATE);
    }
}

export function saveState(state) {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(state)
    );
}