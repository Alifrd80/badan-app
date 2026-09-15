import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import SWRegister from "@/components/SWRegister";
import basePath from "@/lib/basePath";

const vazir = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazir",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "تمرین در خانه",
    template: "%s | تمرین در خانه",
  },
  description:
    "برنامه سیزده هفته‌ای تمرین با وزن بدن در خانه — سه سطح مبتدی، متوسط و حرفه‌ای با ویدیوی هر حرکت",
  applicationName: "تمرین در خانه",
  appleWebApp: { capable: true, title: "تمرین در خانه", statusBarStyle: "default" },
  manifest: `${basePath}/manifest.webmanifest`,
};

export const viewport: Viewport = {
  themeColor: "#059669",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className={`${vazir.variable} h-full`}>
      <body className="flex min-h-dvh flex-col bg-zinc-50 font-[family-name:var(--font-vazir)] text-zinc-900 antialiased">
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col bg-white shadow-sm dark:bg-zinc-900">
          <header className="sticky top-0 z-20 border-b border-zinc-100 bg-white/95 px-4 py-3 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/95">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-lg font-bold text-white">
                ت
              </span>
              <div>
                <p className="text-sm font-bold leading-tight">تمرین در خانه</p>
                <p className="text-[11px] leading-tight text-zinc-400">
                  برنامه ۱۳ هفته‌ای — وزن بدن
                </p>
              </div>
            </div>
          </header>
          <main className="flex-1 px-4 pb-24 pt-4">{children}</main>
          <BottomNav />
        </div>
        <SWRegister />
      </body>
    </html>
  );
}