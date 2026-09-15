"use client";

import { useState } from "react";
import VideoEmbed from "@/components/VideoEmbed";
import { exerciseLabel, pullWithoutBar } from "@/lib/data";

export default function PullNoBarPage() {
  const [week, setWeek] = useState(1);
  const [open, setOpen] = useState(false);
  const w = pullWithoutBar.find((x) => x.index === week);

  return (
    <div>
      <h1 className="mb-1 text-lg font-bold">پول بدون میله</h1>
      <p className="mb-4 text-xs leading-6 text-zinc-500">
        اگر میله بارفیکس ندارید، به‌جای تمرینات پول از این برنامه استفاده کنید.
        کیف (کتاب و بطری آب) باید هرچه جلوتر سنگین‌تر شود.
      </p>

      <section className="mb-4">
        <h2 className="mb-2 text-sm font-bold">هفته</h2>
        <div className="grid grid-cols-7 gap-1.5">
          {Array.from({ length: 13 }).map((_, i) => (
            <button
              key={i + 1}
              onClick={() => setWeek(i + 1)}
              className={`rounded-lg py-2 text-xs font-medium ${
                week === i + 1 ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-500"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </section>

      {w?.note ? (
        <p className="mb-3 rounded-lg bg-amber-50 px-3 py-2 text-xs leading-6 text-amber-800">
          {w.note}
        </p>
      ) : null}

      <div className="space-y-3">
        {w?.exercises.map((e, i) => (
          <div key={e.id + i} className="rounded-xl border border-zinc-200 p-3">
            <button
              className="flex w-full items-center justify-between text-start"
              onClick={() => setOpen((o) => !o)}
            >
              <div>
                <p className="text-sm font-medium">{exerciseLabel(e)}</p>
                <p className="mt-0.5 text-xs text-zinc-400">
                  {e.repsDisplay}
                  {e.holdTop ? " · با دو ثانیه مکث در بالا" : ""}
                </p>
              </div>
              <span className="text-zinc-400">▾</span>
            </button>
            {open ? (
              <div className="mt-3">
                <VideoEmbed id={e.id} fa={exerciseLabel(e)} />
              </div>
            ) : null}
          </div>
        ))}
      </div>

      <a
        href="https://www.digikala.com/product/dkp-4937793/"
        target="_blank"
        rel="noreferrer"
        className="mt-6 block rounded-xl bg-zinc-900 p-4 text-center text-sm font-medium text-white"
      >
        پیشنهاد: خرید میله بارفیکس (دیجی‌کالا) ←
      </a>
    </div>
  );
}