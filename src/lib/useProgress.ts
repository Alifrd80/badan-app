"use client";

import { useCallback, useEffect, useState } from "react";
import type { LevelKey } from "@/lib/types";

const LS_LEVEL = "badan:level";
const LS_WEEK = "badan:week";
const LS_DONE = "badan:done";

interface DoneDay {
  [itemIndex: number]: boolean;
  abs?: boolean;
}

interface DoneSet {
  [key: string]: DoneDay;
}

function loadDone(): DoneSet {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(LS_DONE) ?? "{}");
  } catch {
    return {};
  }
}

export function useSettings() {
  const [level, setLevel] = useState<LevelKey>(() => {
    if (typeof window === "undefined") return "beginner";
    const v = window.localStorage.getItem(LS_LEVEL);
    return v === "intermediate" || v === "professional" ? v : "beginner";
  });
  const [week, setWeek] = useState<number>(() => {
    if (typeof window === "undefined") return 1;
    const v = Number(window.localStorage.getItem(LS_WEEK));
    return v >= 1 && v <= 13 ? v : 1;
  });

  const changeLevel = useCallback((lv: LevelKey) => {
    setLevel(lv);
    try {
      window.localStorage.setItem(LS_LEVEL, lv);
    } catch {
      /* noop */
    }
  }, []);

  const changeWeek = useCallback((w: number) => {
    setWeek(w);
    try {
      window.localStorage.setItem(LS_WEEK, String(w));
    } catch {
      /* noop */
    }
  }, []);

  return { level, week, changeLevel, changeWeek };
}

export function useProgress(level: LevelKey) {
  const [done, setDone] = useState<DoneSet>(loadDone);

  useEffect(() => {
    try {
      window.localStorage.setItem(LS_DONE, JSON.stringify(done));
    } catch {
      /* noop */
    }
  }, [done]);

  const dayKey = useCallback(
    (week: number, day: string) => `${level}:${week}:${day}`,
    [level],
  );

  const toggleItem = useCallback(
    (week: number, day: string, itemIndex: number, value?: boolean) => {
      setDone((prev) => {
        const k = dayKey(week, day);
        const cur = prev[k] ?? {};
        const now = value ?? !cur[itemIndex];
        const next = { ...cur, [itemIndex]: now };
        return { ...prev, [k]: next };
      });
    },
    [dayKey],
  );

  const markDayAbs = useCallback(
    (week: number, day: string, doneAbs: boolean) => {
      setDone((prev) => {
        const k = dayKey(week, day);
        const cur = prev[k] ?? {};
        return { ...prev, [k]: { ...cur, abs: doneAbs } };
      });
    },
    [dayKey],
  );

  const resetDay = useCallback(
    (week: number, day: string) => {
      setDone((prev) => {
        const next = { ...prev };
        delete next[dayKey(week, day)];
        return next;
      });
    },
    [dayKey],
  );

  const isDone = useCallback(
    (week: number, day: string, itemIndex: number) =>
      !!(done[dayKey(week, day)]?.[itemIndex] ?? false),
    [done, dayKey],
  );

  const isAbsDone = useCallback(
    (week: number, day: string) =>
      !!(done[dayKey(week, day)]?.abs ?? false),
    [done, dayKey],
  );

  return { done, toggleItem, markDayAbs, resetDay, isDone, isAbsDone };
}

/** ترکیب ست‌های «اصلی» و «جایگزین» هر حرکت برای نمودار پیشرفت */
export function totalItemSets(e: { sets: number; alt?: { sets: number } }) {
  return e.sets + (e.alt ? e.alt.sets : 0);
}