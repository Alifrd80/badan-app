"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  getWeek,
  levels,
  todayKey,
  typeTitle,
  weekdayTitleForToday,
  absCircuit,
} from "@/lib/data";
import { useProgress, useSettings } from "@/lib/useProgress";

export default function Home() {
  const { level, week, changeLevel, changeWeek } = useSettings();
  const { isDone, isAbsDone } = useProgress(level);
  const today = todayKey();

  const weekData = useMemo(() => getWeek(level, week), [level, week]);
  const todayDay = weekData?.days.find((d) => d.key === today);

  if (!weekData) return null;

  const restDay = !todayDay || todayDay.type === "rest";
  const doneCount = todayDay ? todayDay.exercises.filter((_, i) => isDone(week, todayDay.key, i)).length : 0;
  const totalCount = todayDay?.exercises.length ?? 0;
  const absDone = todayDay?.hasAbs ? isAbsDone(week, todayDay.key) : true;
  const allDone = !restDay && doneCount === totalCount && absDone;

  return (
    <div>
      {/* بنر امروز */}
      <section
        className={`mb-4 rounded-2xl p-4 text-white ${
          restDay ? "bg-zinc-700" : allDone ? "bg-emerald-700" : "bg-emerald-600"
        }`}
      >
        <p className="text-xs opacity-80">امروز · {weekdayTitleForToday()}</p>
        {restDay ? (
          <>
            <h1 className="mt-1 text-xl font-bold">روز استراحت</h1>
            <p className="mt-1 text-sm leading-6 opacity-90">
              به بدن‌تان ریکاوری بدهید؛ آب کافی بنوشید و شب حتماً استراحت کنید.
            </p>
          </>
        ) : (
          <>
            <h1 className="mt-1 text-xl font-bold">
              {typeTitle(todayDay!.type)} — هفته {week}
            </h1>
            <p className="mt-1 text-sm opacity-90">
              {doneCount}/{totalCount} حرکت
              {todayDay!.hasAbs ? (absDone ? " و شکم انجام شد" : " · شکم باقی مانده") : ""}
            </p>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/30">
              <div
                className="h-full rounded-full bg-white transition-all duration-500"
                style={{
                  width: `${totalCount ? Math.round((doneCount / totalCount) * 100) : 0}%`,
                }}
              />
            </div>
            <Link
              href={`/day/${week}/${today}`}
              className="mt-4 inline-block rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-emerald-700"
            >
              شروع تمرین امروز →
            </Link>
          </>
        )}
      </section>

      {/* سطح */}
      <section className="mb-4">
        <h2 className="mb-2 text-sm font-bold">سطح من</h2>
        <div className="grid grid-cols-3 gap-2">
          {levels.map((l) => (
            <button
              key={l.key}
              onClick={() => changeLevel(l.key)}
              className={`rounded-xl border py-2.5 text-sm font-medium transition-colors ${
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

      {/* هفته */}
      <section className="mb-5">
        <h2 className="mb-2 text-sm font-bold">هفته</h2>
        <div className="grid grid-cols-7 gap-1.5">
          {Array.from({ length: 13 }).map((_, i) => {
            const w = i + 1;
            return (
              <button
                key={w}
                onClick={() => changeWeek(w)}
                className={`rounded-lg py-2 text-xs font-medium transition-colors ${
                  week === w ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-500"
                }`}
              >
                {w}
              </button>
            );
          })}
        </div>
      </section>

      {/* روزهای هفته */}
      <section className="mb-6">
        <h2 className="mb-2 text-sm font-bold">روزهای هفته {week}</h2>
        <WeekDays level={level} week={week} />
      </section>

      {/* میان‌برهای سریع */}
      <section className="mb-4">
        <h2 className="mb-2 text-sm font-bold">دسترسی سریع</h2>
        <div className="grid grid-cols-2 gap-2">
          <QuickLink href="/abs" title="سرکیت شکم" desc={`${absCircuit.workSeconds} ثانیه هر حرکت`} />
          <QuickLink href="/pull-no-bar" title="پول بدون میله" desc="برنامه جایگزین" />
          <QuickLink href="/exercises" title="آموزش حرکات" desc="ویدیوی ۶۹ حرکت" />
          <QuickLink href="/nutrition" title="تغذیه" desc="محاسبه کالری و رژیم" />
        </div>
      </section>
    </div>
  );
}

function WeekDays({ level, week }: { level: "beginner" | "intermediate" | "professional"; week: number }) {
  const { isDone, isAbsDone } = useProgress(level);
  const weekData = getWeek(level, week);
  if (!weekData) return null;
  return (
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
        const done = d.exercises.filter((_, i) => isDone(week, d.key, i)).length;
        const absOn = d.hasAbs && isAbsDone(week, d.key);
        return (
          <Link
            key={d.key}
            href={`/day/${week}/${d.key}`}
            className="flex items-center justify-between rounded-xl border border-zinc-200 px-4 py-3 transition-colors hover:border-emerald-300"
          >
            <div className="flex items-center gap-3">
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold ${
                  done === d.exercises.length && absOn && d.exercises.length
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-zinc-100 text-zinc-500"
                }`}
              >
                {done}/{d.exercises.length}
              </span>
              <div>
                <p className="text-sm font-medium">{d.fa}</p>
                <p className="text-[11px] text-zinc-400">
                  {typeTitle(d.type)}
                  {d.hasAbs ? " + شکم" : ""}
                </p>
              </div>
            </div>
            <span className="text-zinc-300">←</span>
          </Link>
        );
      })}
    </div>
  );
}

function QuickLink({ href, title, desc }: { href: string; title: string; desc: string }) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-zinc-200 p-3 transition-colors hover:border-emerald-300"
    >
      <p className="text-sm font-medium">{title}</p>
      <p className="mt-0.5 text-[11px] text-zinc-400">{desc}</p>
    </Link>
  );
}