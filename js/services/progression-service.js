import { XP_CONFIG } from "../config/xp-config.js";

const { XP_PER_LEVEL } = XP_CONFIG;

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

    return (
        (level - 1) * XP_PER_LEVEL
    );
}

export function getProgression(xp) {
    const safeXP = Number.isFinite(xp) && xp >= 0 ? xp: 0;
    const level = getLevelFromXP(safeXP);
    const nextLevel = level + 1;
    const nextLevelXP = getXPForLevel(nextLevel);
    const percentage = nextLevelXP > 0 ? Math.min(100, Math.round((safeXP / nextLevelXP) * 100)) : 100;

    return {
        level,
        currentXP: safeXP,
        currentLevelXP: getXPForLevel(level),
        nextLevelXP,
        xpIntoCurrentLevel: safeXP - getXPForLevel(level),
        xpRequiredForNextLevel: nextLevelXP - getXPForLevel(level),
        xpRemaining: Math.max(0, nextLevelXP - safeXP),
        percentage
    };
}