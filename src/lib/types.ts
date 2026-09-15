export type LevelKey = "beginner" | "intermediate" | "professional";

export interface Exercise {
  id: string;
  fa: string;
  cat: string;
  note?: string;
}

export interface AltExercise {
  id: string;
  sets: number;
  reps?: number | null;
  repsDisplay: string;
  eachSide?: boolean;
  failure?: boolean;
  holdTop?: boolean;
  note?: string;
}

export interface ProgramExercise extends AltExercise {
  alt?: AltExercise;
}

export interface Day {
  key: string;
  fa: string;
  type: "upper" | "legs" | "push" | "pull" | "rest" | string;
  hasAbs: boolean;
  exercises: ProgramExercise[];
  note?: string;
}

export interface Week {
  index: number;
  days: Day[];
}

export interface VideoInfo {
  id: string;
  fa: string;
  videoId: string | null;
  order: number;
  embedUrl?: string;
  fallbackUrl?: string;
}

export interface AbsExercise {
  id: string;
  fa: string;
}

export interface PwbWeek {
  index: number;
  note?: string;
  exercises: ProgramExercise[];
}

export interface CalorieRow {
  fa: string;
  portion: string;
  protein: number;
  fat: number;
  carbs: number;
  kcal: number;
}

export interface CalorieCategory {
  cat: string;
  rows: CalorieRow[];
}