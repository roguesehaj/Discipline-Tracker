export type StreakPayload = {
  userId: string;
  currentStreak: number;
  lastCheckInDate: string;
  goal: number;
  lastResetDate?: string | null;
  updatedAt?: string;
};

export function getOrCreateUserId(): string {
  if (typeof window === "undefined") return "";
  const key = "ds_userId";
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

export async function fetchStreak(
  userId: string
): Promise<StreakPayload | null> {
  try {
    const res = await fetch(`/api/streak?userId=${encodeURIComponent(userId)}`);
    if (!res.ok) return null;
    return (await res.json()) as StreakPayload;
  } catch {
    return null;
  }
}

export async function upsertStreak(payload: StreakPayload): Promise<boolean> {
  try {
    const res = await fetch("/api/streak", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch {
    return false;
  }
}
