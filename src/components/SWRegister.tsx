"use client";

import { useEffect } from "react";
import basePath from "@/lib/basePath";

export default function SWRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker
      .register(`${basePath}/sw.js`)
      .catch(() => {
        /* ثبت نام ناموفق — مهم نیست */
      });
  }, []);
  return null;
}