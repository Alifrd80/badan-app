"use client";

import { useState } from "react";
import Link from "next/link";
import {
  absCircuit,
  absRestSeconds,
  altLabel,
  dayOrder,
  exerciseLabel,
  getWeek,
  levels,
  typeTitle,
} from "@/lib/data";
import type { LevelKey, ProgramExercise } from "@/lib/types";
import { useProgress } from "@/lib/useProgress";
import VideoEmbed from "./VideoEmbed";
import RestTimer from "./RestTimer";

export default function WorkoutPlayer({
  level,
  week,
  day,
}: {
  level: LevelKey;
  week: number;
  day: string;
}) {
  const { isDone, toggleItem, isAbsDone, markDayAbs } = useProgress(level);
  const weekData = getWeek(level, week);
  const d = weekData?.days.find((x) => x.key === day);

  if (!d) return null;

  return (
    <div>
      <header className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-zinc-400">
            سطح {levels.find((l) => l.key === level)?.fa} · هفته {week}
          </p>
          <h1 className="mt-1 text-lg font-bold">
            {d.fa} {typeTitle(d.type)}
          </h1>
        </div>
        <Link
          href="/program"
          className="text-sm text-emerald-600 underline underline-offset-4"
        >
          برنامه
        </Link>
      </header>

      <WorkoutContent
        level={level}
        week={week}
        day={d}
        isDone={isDone}
        markDone={(w, dy, i) => toggleItem(w, dy, i)}
        isAbsDone={isAbsDone}
        markAbsDone={(w, dy) => markDayAbs(w, dy, !isAbsDone(w, dy))}
      />

      <footer className="mt-8 flex items-center justify-between border-t border-zinc-100 pt-4">
        <PrevNextLink week={week} dayKey={d.key} dir="prev" />
        <PrevNextLink week={week} dayKey={d.key} dir="next" />
      </footer>
    </div>
  );
}

function WorkoutContent({
  level,
  week,
  day,
  isDone,
  markDone,
  isAbsDone,
  markAbsDone,
}: {
  level: LevelKey;
  week: number;
  day: { key: string; fa: string; type: string; exercises: ProgramExercise[]; hasAbs: boolean };
  isDone: (week: number, day: string, i: number) => boolean;
  markDone: (week: number, day: string, i: number) => void;
  isAbsDone: (week: number, day: string) => boolean;
  markAbsDone: (week: number, day: string) => void;
}) {
  const total = day.exercises.length;
  const done = day.exercises.filter((_, i) => isDone(week, day.key, i)).length;
  const absOn = isAbsDone(week, day.key);

  const [focus, setFocus] = useState<number | null>(null);

  return (
    <div>
      <div className="mb-4 rounded-xl bg-zinc-900 p-3 text-white">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">
            پیشرفت: {done}/{total}
          </p>
          <p className="text-xs opacity-70">
            {day.hasAbs ? `سرکیت شکم: ${absOn ? "انجام شد" : "مانده"}` : ""}
          </p>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/20">
          <div
            className="h-full rounded-full bg-emerald-400 transition-all duration-300"
            style={{ width: total ? `${(done / total) * 100}%` : "0%" }}
          />
        </div>
      </div>

      <div className="space-y-3">
        {day.exercises.map((e, i) => (
          <ExerciseCard
            key={e.id + i}
            e={e}
            isDone={isDone(week, day.key, i)}
            onToggle={() => markDone(week, day.key, i)}
            onFocus={() => setFocus(i)}
          />
        ))}
      </div>

      {day.hasAbs ? (
        <div className="mt-6">
          <h2 className="mb-2 text-sm font-bold">سرکیت شکم</h2>
          <AbsPanel
            week={week}
            isDone={absOn}
            onDone={() => markAbsDone(week, day.key)}
          />
        </div>
      ) : null}

      {focus !== null && day.exercises[focus] ? (
        <FocusMode e={day.exercises[focus]} onClose={() => setFocus(null)} level={level} />
      ) : null}
    </div>
  );
}

function ExerciseCard({
  e,
  isDone,
  onToggle,
  onFocus,
}: {
  e: ProgramExercise;
  isDone: boolean;
  onToggle: () => void;
  onFocus: () => void;
}) {
  const [open, setOpen] = useState(false);
  const alt = altLabel(e);
  const isFailure = e.repsDisplay.includes("ناتوانی");

  return (
    <div
      className={`rounded-xl border p-3 transition-colors ${
        isDone ? "border-emerald-200 bg-emerald-50/60" : "border-zinc-200"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <button className="min-w-0 flex-1 text-start" onClick={() => setOpen((o) => !o)}>
          <p className="text-sm font-medium">{exerciseLabel(e)}</p>
          <p className="mt-0.5 text-xs text-zinc-400">
            {e.repsDisplay}
            {e.eachSide ? " (هر طرف)" : ""}
            {e.holdTop ? " · با مکث در بالا" : ""}
            {e.failure && isFailure ? " · تا ناتوانی" : ""}
          </p>
          {alt ? (
            <p className="mt-1 text-[11px] text-zinc-400">
              یا: {alt.label}
              {e.alt ? ` ${e.alt.sets}×${altNote(e.alt)}` : ""}
            </p>
          ) : null}
          {e.note ? (
            <p className="mt-2 rounded bg-amber-50 px-2 py-1 text-[11px] leading-5 text-amber-800">
              {e.note}
            </p>
          ) : null}
        </button>
        <div className="flex shrink-0 flex-col items-center gap-1">
          <button
            onClick={onToggle}
            className={`flex h-8 w-8 items-center justify-center rounded-full border text-sm ${
              isDone
                ? "border-emerald-600 bg-emerald-600 text-white"
                : "border-zinc-300 text-transparent"
            }`}
            aria-label="انجام شد"
          >
            ✓
          </button>
          <button
            onClick={onFocus}
            className="text-[11px] text-zinc-400 underline underline-offset-2"
          >
            تمرکز
          </button>
        </div>
      </div>
      {open ? (
        <div className="mt-3">
          <VideoEmbed id={e.id} fa={exerciseLabel(e)} />
        </div>
      ) : null}
    </div>
  );
}

export function AbsPanel({
  week,
  isDone,
  onDone,
}: {
  week: number;
  isDone: boolean;
  onDone: () => void;
}) {
  const secs = absRestSeconds(week);
  const [finish, setFinish] = useState(false);

  return (
    <div className="space-y-3">
      <div className="rounded-xl bg-zinc-900 p-3 text-white">
        <p className="text-sm">
          هر حرکت {absCircuit.workSeconds} ثانیه · بین حرکات {secs} ثانیه استراحت
        </p>
        <p className="mt-1 text-[11px] leading-5 opacity-70">{absCircuit.note}</p>
      </div>

      {absCircuit.exercises.map((ex, i) => (
        <div
          key={i}
          className="space-y-2"
        >
          <div className="flex items-center justify-between rounded-xl border border-zinc-200 p-3">
            <p className="text-sm">
              {i + 1}. {ex.fa}
            </p>
            <button
              onClick={onDone}
              className={`h-6 w-6 rounded-full border text-xs ${
                isDone
                  ? "border-emerald-600 bg-emerald-600 text-white"
                  : "border-zinc-300"
              }`}
              aria-label="انجام شد"
            >
              ✓
            </button>
          </div>
          <RestTimer seconds={secs} onClose={() => {}} />
        </div>
      ))}

      <button
        onClick={() => setFinish((f) => !f)}
        className="w-full rounded-xl border border-dashed border-zinc-300 py-3 text-sm text-zinc-400"
      >
        {finish ? "سرکیت بعدی؟" : "استراحت دو دقیقه‌ای"}
      </button>
      {finish ? <RestTimer seconds={120} onClose={() => {}} /> : null}
    </div>
  );
}

function FocusMode({
  e,
  onClose,
  level,
}: {
  e: ProgramExercise;
  onClose: () => void;
  level: LevelKey;
}) {
  const totalSets = Math.max(e.sets, e.alt?.sets ?? 0, 1);
  const rows = Math.min(totalSets, 5);
  const [row, setRow] = useState(1);
  const [rest, setRest] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3">
        <button onClick={onClose} className="text-sm text-zinc-500">
          بستن ✕
        </button>
        <p className="text-sm font-medium">
          {exerciseLabel(e)} · سطح {levels.find((l) => l.key === level)?.fa}
        </p>
        <span className="w-10" />
      </div>

      <VideoEmbed id={e.id} fa={exerciseLabel(e)} />

      <div className="flex-1 overflow-y-auto p-4">
        <p className="mb-3 rounded-lg bg-zinc-50 p-3 text-center text-base font-bold">
          {e.repsDisplay}
        </p>

        <div className="mb-4 flex items-center justify-center gap-2 text-sm">
          <button onClick={() => setRow((r) => Math.max(1, r - 1))} className="rounded-lg bg-zinc-100 px-3 py-1.5">
            −
          </button>
          <span className="min-w-10 text-center font-bold tabular-nums">
            {row} / {rows}
          </span>
          <button onClick={() => setRow((r) => Math.min(rows, r + 1))} className="rounded-lg bg-zinc-100 px-3 py-1.5">
            +
          </button>
        </div>

        <div className="grid grid-cols-5 gap-1.5">
          {Array.from({ length: rows }).map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full ${i < row ? "bg-emerald-600" : "bg-zinc-200"}`}
            />
          ))}
        </div>

        <button
          onClick={() => setRest((r) => !r)}
          className="mt-4 w-full rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white"
        >
          {rest ? "بستن تایمر" : "شروع استراحت (۴۵ ث)"}
        </button>
        {rest ? <RestTimer seconds={45} onClose={() => setRest(false)} /> : null}
      </div>
    </div>
  );
}

function altNote(a: { reps?: number | null; holdTop?: boolean }): string {
  return `${a.reps}${a.holdTop ? " با مکث" : ""}`;
}

function PrevNextLink({
  week,
  dayKey,
  dir,
}: {
  week: number;
  dayKey: string;
  dir: "prev" | "next";
}) {
  const order = dayOrder.map((d) => d.key);
  const cur = order.indexOf(dayKey);
  const next = dir === "prev" ? cur - 1 : cur + 1;
  if (next < 0 || next >= order.length) {
    return <span className="w-16" />;
  }
  const nk = order[next];
  return (
    <Link href={`/day/${week}/${nk}`} className="text-sm text-zinc-500">
      {dir === "prev" ? "→ قبل" : "بعد ←"}
    </Link>
  );
}