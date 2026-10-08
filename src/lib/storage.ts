"use client";
import { useCallback, useEffect, useState, type SetStateAction } from "react";

// Native preferences survive activity recreation and app updates; browser uses localStorage.
declare global { interface Window { BadanNative?: { get(key: string): string | null; set(key: string, value: string): void; remove(key: string): void }; } }
export const storage = {
  getItem(key: string): string | null {
    if (typeof window === "undefined") return null;
    if (window.BadanNative) return window.BadanNative.get(key);
    return window.localStorage.getItem(key);
  },
  setItem(key: string, value: string) {
    if (window.BadanNative) window.BadanNative.set(key, value);
    else window.localStorage.setItem(key, value);
    window.dispatchEvent(new Event("badan-storage"));
  },
  removeItem(key: string) {
    if (window.BadanNative) window.BadanNative.remove(key);
    else window.localStorage.removeItem(key);
    window.dispatchEvent(new Event("badan-storage"));
  },
};
export function readValue<T>(key: string, fallback: T): T {
  try { const value = JSON.parse(storage.getItem(key) ?? "null"); return value === null ? fallback : value; } catch { return fallback; }
}
export function useSavedState<T>(key: string, initial: T) {
  const [value, setValue] = useState(initial);
  useEffect(() => { setValue(readValue(key, initial)); }, [key]); // initial is a stable default
  const change = useCallback((next: SetStateAction<T>) => {
    const previous = readValue(key, initial);
    const result = typeof next === "function" ? (next as (x: T) => T)(previous) : next;
    storage.setItem(key, JSON.stringify(result));
    setValue(result);
  }, [key, initial]);
  return [value, change] as const;
}
