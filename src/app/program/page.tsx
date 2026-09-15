"use client";

import Link from "next/link";
import { useMemo } from "react";
import { getWeek, levels, typeTitle } from "@/lib/data";
import { useSettings } from "@/lib/useProgress";

export default function ProgramPage() {
  const { level, week, changeLevel, changeWeek } = useSettings();
  const weekData = useMemo(() => getWeek(level, week), [level, week]);

  if (!weekData) return null;

  return (
    <div>
      <h1 className="mb-1 text-lg font-bold">برنامه</h1>
      <p className="mb-4 text-xs leading-6 text-zinc-400">
        هر دو هفته سختی تمرینات بیشتر می‌شود؛ از هفته هفتم ساختار روزها به شکل
        پوش/پول/پا تغیییر می‌کند.
      </p>

      <section className="mb-4">
        <h2 className="mb-2 text-sm font-bold">سطح</h2>
        <div className="grid grid-cols-3 gap-2">
          {levels.map((l) => (
            <button
              key={l.key}
              onClick={() => changeLevel(l.key)}
              className={`rounded-xl border py-2.5 text-sm font-medium ${
                level === l.key
                  ? "border-emerald-600 bg-emerald-600 text-white"
                  : "border-zinc-200 text-zinc-600"
              }`}
            >
              {l.fa}
            </button>
          ))}
        </div>
      </section>

      <section className="mb-5">
        <h2 className="mb-2 text-sm font-bold">هفته</h2>
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

      <section>
        <h2 className="mb-2 text-sm font-bold">روزهای هفته {week}</h2>
        <div className="space-y-2">
          {weekData.days.map((d) => {
            if (d.type === "rest") {
              return (
                <div
                  key={d.key}
                  className="flex items-center justify-between rounded-xl border border-dashed border-zinc-200 px-4 py-3 text-sm text-zinc-400"
                >
                  <span>{d.fa}</span>
                  <span className="text-xs">استراحت</span>
                </div>
              );
            }
            return (
              <Link
                key={d.key}
                href={`/day/${week}/${d.key}`}
                className="flex items-center justify-between rounded-xl border border-zinc-200 px-4 py-3 transition-colors hover:border-emerald-300"
              >
                <div>
                  <p className="text-sm font-medium">{d.fa}</p>
                  <p className="text-[11px] text-zinc-400">
                    {typeTitle(d.type)}
                    {d.hasAbs ? " + سرکیت شکم" : ""} · {d.exercises.length} حرکت
                  </p>
                </div>
                <span className="text-zinc-300">←</span>
              </Link>
            );
          })}
        </div>
      </section>

      <p className="mt-6 rounded-xl bg-zinc-100 p-3 text-xs leading-6 text-zinc-500">
        نکته: بین ست‌ها ۴۵ ثانیه تا ۳ دقیقه استراحت کنید (پیشنهاد: ۱ دقیقه و ۳۰
        ثانیه) و بین حرکات ۲ تا ۵ دقیقه. اگر هفته‌ای خیلی سخت بود، همان هفته را
        تکرار کنید.
      </p>
    </div>
  );
}