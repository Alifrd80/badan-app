import exercisesJson from "@/data/exercises.json";
import videoMapJson from "@/data/exercise-video-map.json";
import programsJson from "@/data/programs.json";
import absJson from "@/data/absCircuit.json";
import pwbJson from "@/data/pullWithoutBar.json";
import nutritionJson from "@/data/nutrition.json";
import calorieJson from "@/data/calorie.json";
import notesJson from "@/data/notes.json";

import type {
  AbsExercise,
  CalorieCategory,
  Day,
  Exercise,
  LevelKey,
  ProgramExercise,
  PwbWeek,
  VideoInfo,
  Week,
} from "./types";

export const exercises = exercisesJson.items as Exercise[];
export const videoMap = videoMapJson.items as VideoInfo[];
export const programs = programsJson;
export const absCircuit = absJson;
export const pullWithoutBar = pwbJson.weeks as PwbWeek[];
export const nutrition = nutritionJson;
export const calorie = calorieJson;
export const notes = notesJson;

export const levels: { key: LevelKey; fa: string }[] = [
  { key: "beginner", fa: "مبتدی" },
  { key: "intermediate", fa: "متوسط" },
  { key: "professional", fa: "حرفه‌ای" },
];

const exerciseIndex = new Map(exercises.map((e) => [e.id, e]));
const videoIndex = new Map(videoMap.map((v) => [v.id, v]));

export function getExercise(id: string | undefined): Exercise | undefined {
  if (!id) return undefined;
  return exerciseIndex.get(id);
}

export function getVideo(id: string | undefined): VideoInfo | undefined {
  if (!id) return undefined;
  return videoIndex.get(id);
}

export function getPreparedVideo(id: string | undefined): VideoInfo {
  const v = getVideo(id);
  if (!v || !v.videoId) return { id: id ?? "-", fa: "", videoId: null, order: 0 };
  return {
    ...v,
    embedUrl: `https://drive.google.com/file/d/${v.videoId}/preview`,
    fallbackUrl: `https://drive.google.com/file/d/${v.videoId}/view`,
  };
}

export function getLevelWeeks(level: LevelKey): Week[] {
  return programs.programs[level]?.weeks ?? [];
}

export function getLevelFa(level: LevelKey): string {
  return programs.programs[level]?.fa ?? "";
}

export function getWeek(level: LevelKey, weekIndex: number): Week | undefined {
  return getLevelWeeks(level).find((w) => w.index === weekIndex);
}

export function getDay(
  level: LevelKey,
  weekIndex: number,
  dayKey: string,
): Day | undefined {
  return getWeek(level, weekIndex)?.days.find((d) => d.key === dayKey);
}

/** نام تمرین برای نمایش (با احتساب alt) */
export function exerciseLabel(e: ProgramExercise): string {
  return getExercise(e.id)?.fa ?? e.id;
}

export function altLabel(e: ProgramExercise): { label: string; note?: string } | null {
  if (!e.alt) return null;
  return {
    label: getExercise(e.alt.id)?.fa ?? e.alt.id,
    note: e.alt.note,
  };
}

/** روزهای هفته به ترتیب برنامه (شنبه = شروع) */
export const dayOrder: { key: string; fa: string }[] = [
  { key: "sat", fa: "شنبه" },
  { key: "sun", fa: "یکشنبه" },
  { key: "mon", fa: "دوشنبه" },
  { key: "tue", fa: "سه‌شنبه" },
  { key: "wed", fa: "چهارشنبه" },
  { key: "thu", fa: "پنجشنبه" },
  { key: "fri", fa: "جمعه" },
];

/** کلیدِ امروز (بر اساس تقویم فارسی مرورگر) */
export function todayKey(): string {
  try {
    const name = new Intl.DateTimeFormat("fa-IR", { weekday: "long" }).format(
      new Date(),
    );
    for (const d of dayOrder) {
      if (name.includes(d.fa)) return d.key;
    }
  } catch {
    /* noop */
  }
  // fallback: ساعت‌چرخشی ساده
  const days = dayOrder.map((d) => d.key); // sat first
  return days[(new Date().getDay() + 6) % 7];
}

export function weekdayTitleForToday(): string {
  for (const d of dayOrder) if (d.key === todayKey()) return d.fa;
  return "";
}

export function typeTitle(type: string): string {
  switch (type) {
    case "upper":
      return "بالاتنه";
    case "push":
      return "پوش";
    case "pull":
      return "پول";
    case "legs":
      return "پا";
    case "rest":
      return "استراحت";
    default:
      return type;
  }
}

export function catTitle(cat: string): string {
  return (
    (exercisesJson as unknown as { categories?: Record<string, string> })
      ?.categories?.[cat] ?? cat
  );
}

export const categories = (exercisesJson as unknown as { categories?: Record<string, string> })
  ?.categories ?? {};

export const absList: AbsExercise[] = absCircuit.exercises;

export function absRestSeconds(week: number): number {
  const range = absCircuit.restRanges.find(
    (r: { from: number; to: number; restSeconds: number }) =>
      week >= r.from && week <= r.to,
  );
  return range?.restSeconds ?? 15;
}

export type { CalorieCategory, Day, Exercise, LevelKey, ProgramExercise, Week };