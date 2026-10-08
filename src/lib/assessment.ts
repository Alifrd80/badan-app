import type { LevelKey } from "./types";
export const questions = [
  { title: "چند شنای استانداردِ پشت‌سرهم می‌تونی انجام بدی؟", hint: "با فرم درست و بدون استراحت؛ اگر مطمئن نیستی گزینهٔ اول را انتخاب کن.", options: ["کمتر از ۲۰ یا مطمئن نیستم", "۲۰ تا ۴۰ شنا", "بیشتر از ۴۰ شنا"] },
  { title: "در سه ماه اخیر چقدر منظم تمرین کردی؟", hint: "برای شناخت سابقه‌ات؛ معیار اصلی سطح همان تعداد شنا در راهنمای برنامه است.", options: ["تازه شروع می‌کنم یا برگشتم", "هفته‌ای یک یا دو جلسه", "هفته‌ای سه جلسه یا بیشتر"] },
  { title: "به میلهٔ بارفیکس دسترسی داری؟", hint: "اگر نداری، جایگزین‌های کیف و برنامهٔ پول بدون میله در دسترس هستند.", options: ["نه، بدون میله تمرین می‌کنم", "بله، میله دارم"] },
];
export function levelFromAnswers(answers: number[]): LevelKey {
  return answers[0] === 2 ? "professional" : answers[0] === 1 ? "intermediate" : "beginner";
}
export function validProfile(value: unknown): value is { version: number; level: LevelKey; answers: number[] } {
  if (!value || typeof value !== "object") return false;
  const p = value as { version?: number; level?: string; answers?: number[] };
  return p.version === 1 && Array.isArray(p.answers) && p.answers.length === questions.length && p.answers.every((n, i) => Number.isInteger(n) && n >= 0 && n < questions[i].options.length) && p.level === levelFromAnswers(p.answers);
}
