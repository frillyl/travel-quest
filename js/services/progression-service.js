const XP_PER_LEVEL = 500;

export function getLevelFromXP(xp) {
    if (!Number.isFinite(xp) || xp < 0) {
        return 1;
    }

    return Math.floor(xp / XP_PER_LEVEL) + 1;
}

export function getXPForLevel(level) {
    if (!Number.isInteger(level) || level < 1) {
        return 0;
    }

    return (level - 1) * XP_PER_LEVEL;
}

export function getProgression(xp) {
    const safeXP = Number.isFinite(xp) && xp >= 0 ? xp : 0;
    const level = getLevelFromXP(safeXP);
    const currentLevelXP = getXPForLevel(level);
    const nextLevelXP = getXPForLevel(level + 1);
    const xpIntoCurrentLevel = safeXP - currentLevelXP;
    const xpRequiredForNextLevel = nextLevelXP - currentLevelXP;
    const percentage = Math.min(100, Math.round((xpIntoCurrentLevel / xpRequiredForNextLevel) * 100));

    return {
        level,
        currentXP: safeXP,
        currentLevelXP,
        nextLevelXP,
        xpIntoCurrentLevel,
        xpRequiredForNextLevel,
        xpRemaining:
            Math.max(0, nextLevelXP - safeXP),
        percentage
    };
}