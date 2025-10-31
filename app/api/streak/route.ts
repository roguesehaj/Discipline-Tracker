import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { kv } from "@vercel/kv";

type StreakRecord = {
  userId: string;
  currentStreak: number;
  lastCheckInDate: string;
  goal: number;
  lastResetDate?: string | null;
  updatedAt: string;
};

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "streak.json");

async function ensureDataFile() {
  try {
    await fs.mkdir(dataDir, { recursive: true });
  } catch {}
  try {
    await fs.access(dataFile);
  } catch {
    await fs.writeFile(
      dataFile,
      JSON.stringify({ records: [] as StreakRecord[] }, null, 2),
      "utf-8"
    );
  }
}

async function readAll(): Promise<{ records: StreakRecord[] }> {
  await ensureDataFile();
  const raw = await fs.readFile(dataFile, "utf-8");
  try {
    return JSON.parse(raw);
  } catch {
    return { records: [] };
  }
}

async function writeAll(data: { records: StreakRecord[] }) {
  await ensureDataFile();
  await fs.writeFile(dataFile, JSON.stringify(data, null, 2), "utf-8");
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  // Prefer Upstash Redis if configured
  if (
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    const { Redis } = await import("@upstash/redis");
    const redis = Redis.fromEnv();
    const record = (await redis.hgetall(`streak:${userId}`)) as any;
    if (!record || Object.keys(record).length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(record);
  }

  // Next: Vercel KV if configured
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    const record = (await kv.hgetall(`streak:${userId}`)) as any;
    if (!record || Object.keys(record).length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(record);
  }

  // Fallback to local file store (dev)
  const data = await readAll();
  const record = data.records.find((r) => r.userId === userId);
  if (!record)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(record);
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Partial<StreakRecord>;
  if (!body || !body.userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const now = new Date().toISOString();
  const incoming: StreakRecord = {
    userId: body.userId,
    currentStreak: body.currentStreak ?? 0,
    lastCheckInDate: body.lastCheckInDate ?? now,
    goal: body.goal ?? 90,
    lastResetDate: body.lastResetDate ?? null,
    updatedAt: now,
  };

  // Prefer Upstash Redis if configured
  if (
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    const { Redis } = await import("@upstash/redis");
    const redis = Redis.fromEnv();
    await redis.hset(
      `streak:${incoming.userId}`,
      incoming as Record<string, unknown>
    );
    return NextResponse.json({ ok: true });
  }

  // Next: Vercel KV if configured
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    await kv.hset(
      `streak:${incoming.userId}`,
      incoming as unknown as Record<string, unknown>
    );
    return NextResponse.json({ ok: true });
  }

  // Fallback to local file store (dev)
  const data = await readAll();
  const idx = data.records.findIndex((r) => r.userId === incoming.userId);
  if (idx === -1) {
    data.records.push(incoming);
  } else {
    data.records[idx] = { ...data.records[idx], ...incoming, updatedAt: now };
  }
  await writeAll(data);
  return NextResponse.json({ ok: true });
}
