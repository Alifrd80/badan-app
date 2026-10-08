import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import AppSetup from "@/components/AppSetup";
import BottomNav from "@/components/BottomNav";
import SWRegister from "@/components/SWRegister";
import basePath from "@/lib/basePath";
import Link from "next/link";
import Icon from "@/components/Icon";

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
  themeColor: "#c8f36a",
  colorScheme: "light dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className={`${vazir.variable} h-full`}>
      <body className="antialiased">
        <AppSetup><a className="skip-link" href="#main">رفتن به محتوا</a>
        <div className="app-shell">
          <header className="brand-header"><Link href="/" className="brand"><span className="brand-mark"><Icon name="workout" size={27}/></span><span><strong>بدن<span className="brand-dot">.</span></strong><small>تمرین در خانه</small></span></Link><span className="brand-edition" dir="ltr">BODYWEIGHT / 13 WEEKS</span></header>
          <main id="main" className="app-main">{children}</main>
          <BottomNav />
        </div>
        <SWRegister /></AppSetup>
      </body>
    </html>
  );
}
