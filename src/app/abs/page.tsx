"use client";

import { AbsPanel } from "@/components/WorkoutPlayer";
import { absCircuit } from "@/lib/data";
import { useProgress, useSettings } from "@/lib/useProgress";

export default function AbsPage() {
  const { level, week, changeWeek } = useSettings();
  const { markDayAbs, isAbsDone, resetDay } = useProgress(level);
  const done = isAbsDone(week, "abs");

  return (
    <div>
      <h1 className="mb-1 text-lg font-bold">سرکیت شکم</h1>
      <p className="mb-4 text-xs leading-6 text-zinc-500">
        این سرکیت مشترک همه سطوح است و معمولاً بعد از روز پا انجام می‌شود. هر
        حرکت {absCircuit.workSeconds} ثانیه.
      </p>

      <section className="mb-4">
        <h2 className="mb-2 text-sm font-bold">هفته (برای زمان استراحت)</h2>
        <div className="grid grid-cols-7 gap-1.5">
          {Array.from({ length: 13 }).map((_, i) => {
            const w = i + 1;
            return (
              <button
                key={w}
                onClick={() => changeWeek(w)}
                className={`rounded-lg py-2 text-xs font-medium ${
                  week === w ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-500"
                }`}
              >
                {w}
              </button>
            );
          })}
        </div>
      </section>

      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-medium">امروز:</p>
        <div className="flex gap-2">
          <button
            onClick={() => markDayAbs(week, "abs", !done)}
            className={`rounded-full px-4 py-1.5 text-xs font-medium ${
              done ? "bg-emerald-600 text-white" : "bg-zinc-100 text-zinc-500"
            }`}
          >
            {done ? "انجام شد ✓" : "علامت انجام"}
          </button>
          <button
            onClick={() => resetDay(week, "abs")}
            className="text-xs text-zinc-400 underline"
          >
            صفر کردن
          </button>
        </div>
      </div>

      <AbsPanel
        week={week}
        isDone={done}
        onDone={() => markDayAbs(week, "abs", !done)}
      />
    </div>
  );
}