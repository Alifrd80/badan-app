"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "امروز", icon: "◈" },
  { href: "/program", label: "برنامه", icon: "🗓" },
  { href: "/abs", label: "شکم", icon: "▤" },
  { href: "/nutrition", label: "تغذیه", icon: "🥗" },
  { href: "/more", label: "بیشتر", icon: "⋯" },
];

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    switch (href) {
      case "/":
        return pathname === "/";
      case "/program":
        return pathname === "/program" || pathname.startsWith("/day/");
      case "/more":
        return (
          pathname === "/more" ||
          pathname === "/exercises" ||
          pathname === "/pull-no-bar" ||
          pathname === "/calorie" ||
          pathname === "/notes"
        );
      default:
        return pathname === href;
    }
  };

  return (
    <nav className="sticky bottom-0 z-30 border-t border-zinc-200 bg-white/95 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/95">
      <div className="mx-auto grid max-w-md grid-cols-5">
        {items.map((it) => {
          const active = isActive(it.href);
          return (
            <Link
              key={it.href}
              href={it.href}
              className={`flex flex-col items-center gap-0.5 py-2 text-[11px] transition-colors ${
                active
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-zinc-500 dark:text-zinc-400"
              }`}
            >
              <span className="text-lg leading-none">{it.icon}</span>
              <span>{it.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}