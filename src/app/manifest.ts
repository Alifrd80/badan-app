import type { MetadataRoute } from "next";
import basePath from "@/lib/basePath";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "برنامه تمرین در خانه",
    short_name: "تمرین خانگی",
    description:
      "برنامه سیزده هفته‌ای تمرین با وزن بدن در خانه — سه سطح مبتدی، متوسط و حرفه‌ای",
    start_url: `${basePath}/`,
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#059669",
    dir: "rtl",
    lang: "fa",
    icons: [
      { src: `${basePath}/icons/icon-192.png`, sizes: "192x192", type: "image/png" },
      { src: `${basePath}/icons/icon-512.png`, sizes: "512x512", type: "image/png" },
      { src: `${basePath}/icons/icon-512.png`, sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}