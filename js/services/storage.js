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

export function getState() {
    const rawState = localStorage.getItem(STORAGE_KEY);

    if (!rawState) {
        return createDefaultState();
    }

    try {
        const parsedState = JSON.parse(rawState);

        return {
        ...createDefaultState(),
        ...parsedState
        };
    } catch (error) {
        console.error("Failed to parse Travel Quest state:", error);

        return createDefaultState();
    }
}

export function saveState(state) {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(state)
    );
}

export function resetState() {
    localStorage.removeItem(STORAGE_KEY);
}