"use client";

import { useEffect, useMemo, useState } from "react";

export default function RestTimer({
  seconds = 60,
  onClose,
}: {
  seconds?: number;
  onClose: () => void;
}) {
  const [left, setLeft] = useState(seconds);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setLeft((s) => {
        if (s <= 1) {
          window.clearInterval(id);
          setRunning(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [running]);

  const pct = useMemo(() => (left / seconds) * 100, [left, seconds]);
  const mins = Math.floor(left / 60);
  const secs = left % 60;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6">
      <div className="w-full max-w-xs rounded-2xl bg-white p-5 text-center">
        <p className="mb-1 text-xs text-zinc-400">استراحت</p>
        <p className="text-4xl font-extrabold tabular-nums">
          {mins > 0 ? `${mins}:${String(secs).padStart(2, "0")}` : secs}
        </p>
        <div className="mx-auto mt-3 h-1.5 w-full overflow-hidden rounded-full bg-zinc-200">
          <div
            className="h-full rounded-full bg-emerald-600 transition-all duration-1000 ease-linear"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="mt-4 flex items-center justify-center gap-3">
          <button
            onClick={() => setRunning((r) => !r)}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm"
          >
            {running ? "توقف" : "ادامه"}
          </button>
          <button
            onClick={() => setLeft(seconds)}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm"
          >
            شروع مجدد
          </button>
          <button
            onClick={onClose}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm text-white"
          >
            پایان استراحت
          </button>
        </div>
      </div>
    </div>
  );
}