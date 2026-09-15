"use client";

import { useState } from "react";
import { getPreparedVideo } from "@/lib/data";

export default function VideoEmbed({ id, fa }: { id: string; fa?: string }) {
  const v = getPreparedVideo(id);
  const [mode, setMode] = useState<"embed" | "open">("embed");

  if (!v.videoId) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 p-4 text-center text-sm text-zinc-400">
        ویدیویی برای این تمرین ثبت نشده است
      </div>
    );
  }

  if (mode === "open") {
    return (
      <div className="rounded-xl bg-zinc-100 p-4 text-center dark:bg-zinc-800">
        <p className="mb-2 text-sm text-zinc-500">
          باز کردن در برنامه‌ی پیش‌فرض (GDrive) — در صورت خطای «Permission Denied» از
          گزینه‌ی جستجوی نام تمرین استفاده کنید.
        </p>
        <a
          href={v.fallbackUrl ?? "#"}
          target="_blank"
          rel="noreferrer"
          className="inline-block rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white"
        >
          باز کردن ویدیو
        </a>
        <button
          onClick={() => setMode("embed")}
          className="ms-2 rounded-lg border border-zinc-300 px-4 py-2 text-sm dark:border-zinc-600"
        >
          برگشت به نمایش داخل اپ
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="aspect-video overflow-hidden rounded-xl bg-black">
        <iframe
          src={v.embedUrl}
          title={fa ?? v.fa ?? "ویدیوی حرکت"}
          className="h-full w-full"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      </div>
      {fa ?? v.fa ? (
        <p className="mt-1 text-center text-xs text-zinc-400">ویدیوی: {fa ?? v.fa}</p>
      ) : null}
    </div>
  );
}