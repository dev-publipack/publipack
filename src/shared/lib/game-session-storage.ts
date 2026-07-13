import type { Sponsor } from "@/shared/types";
import { COOLDOWN_DURATION_SECONDS } from "@/config/redesign-game-config";
import { GAME_RULES } from "@/shared/lib/game-config";

export const COOLDOWN_STORAGE_KEY = "publipack_cooldown_end";
export const ATTEMPTS_STORAGE_KEY = "publipack_attempts";
export const LOCK_SCREEN_STORAGE_KEY = "publipack_lock_screen";
export const LOCK_WINNER_STORAGE_KEY = "publipack_lock_winner";

export type LockScreen = "youLost" | "claimSuccess";

export interface StoredWinner {
  name: string;
  reward: string;
  logo: string;
  url?: string;
}

function safeGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // ignore quota / private mode
  }
}

function safeRemove(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

export function readAttempts(): number {
  const raw = safeGet(ATTEMPTS_STORAGE_KEY);
  if (!raw) return 0;
  const value = Number(raw);
  if (!Number.isFinite(value) || value < 0) return 0;
  return Math.min(Math.floor(value), GAME_RULES.MAX_ATTEMPTS);
}

export function writeAttempts(attempts: number): void {
  safeSet(ATTEMPTS_STORAGE_KEY, String(Math.max(0, attempts)));
}

export function readCooldownEnd(): number | null {
  const raw = safeGet(COOLDOWN_STORAGE_KEY);
  if (!raw) return null;
  const value = Number(raw);
  if (!Number.isFinite(value)) return null;
  return value;
}

export function isCooldownActive(now = Date.now()): boolean {
  const end = readCooldownEnd();
  return end != null && end > now;
}

export function getRemainingCooldownSeconds(now = Date.now()): number {
  const end = readCooldownEnd();
  if (end == null) return 0;
  return Math.max(0, Math.ceil((end - now) / 1000));
}

export function startCooldown(now = Date.now()): number {
  const endTime = now + COOLDOWN_DURATION_SECONDS * 1000;
  safeSet(COOLDOWN_STORAGE_KEY, String(endTime));
  return endTime;
}

export function clearCooldown(): void {
  safeRemove(COOLDOWN_STORAGE_KEY);
}

export function readLockScreen(): LockScreen | null {
  const raw = safeGet(LOCK_SCREEN_STORAGE_KEY);
  if (raw === "youLost" || raw === "claimSuccess") return raw;
  return null;
}

export function writeLockScreen(screen: LockScreen): void {
  safeSet(LOCK_SCREEN_STORAGE_KEY, screen);
}

export function clearLockScreen(): void {
  safeRemove(LOCK_SCREEN_STORAGE_KEY);
}

export function readLockWinner(): StoredWinner | null {
  const raw = safeGet(LOCK_WINNER_STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as StoredWinner;
    if (!parsed?.name || !parsed?.reward || !parsed?.logo) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function writeLockWinner(winner: Sponsor | StoredWinner): void {
  const payload: StoredWinner = {
    name: winner.name,
    reward: winner.reward,
    logo: winner.logo,
    url: winner.url,
  };
  safeSet(LOCK_WINNER_STORAGE_KEY, JSON.stringify(payload));
}

export function clearLockWinner(): void {
  safeRemove(LOCK_WINNER_STORAGE_KEY);
}

/** Clear attempts, cooldown and lock UI after timer ends / play again */
export function clearGameSession(): void {
  safeRemove(ATTEMPTS_STORAGE_KEY);
  clearCooldown();
  clearLockScreen();
  clearLockWinner();
}

/**
 * Snapshot used to restore UI after refresh.
 * Expired cooldown is cleared automatically.
 */
export function loadPersistedGameSession(now = Date.now()): {
  attempts: number;
  cooldownActive: boolean;
  remainingSeconds: number;
  lockScreen: LockScreen | null;
  winner: StoredWinner | null;
} {
  const cooldownActive = isCooldownActive(now);

  if (!cooldownActive && readCooldownEnd() != null) {
    // Timer finished while user was away
    clearGameSession();
    return {
      attempts: 0,
      cooldownActive: false,
      remainingSeconds: 0,
      lockScreen: null,
      winner: null,
    };
  }

  if (cooldownActive) {
    const lockScreen = readLockScreen() ?? "youLost";
    return {
      attempts: GAME_RULES.MAX_ATTEMPTS,
      cooldownActive: true,
      remainingSeconds: getRemainingCooldownSeconds(now),
      lockScreen,
      winner: lockScreen === "claimSuccess" ? readLockWinner() : null,
    };
  }

  return {
    attempts: readAttempts(),
    cooldownActive: false,
    remainingSeconds: 0,
    lockScreen: null,
    winner: null,
  };
}

export function lockForExhaustedAttempts(): void {
  writeAttempts(GAME_RULES.MAX_ATTEMPTS);
  startCooldown();
  writeLockScreen("youLost");
  clearLockWinner();
}

export function lockForClaimSuccess(winner: Sponsor | StoredWinner): void {
  writeAttempts(GAME_RULES.MAX_ATTEMPTS);
  startCooldown();
  writeLockScreen("claimSuccess");
  writeLockWinner(winner);
}
