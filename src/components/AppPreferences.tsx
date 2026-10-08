"use client";
import { useEffect, useState } from "react";
import { storage, useSavedState } from "@/lib/storage";
import localVideos from "@/lib/localVideos.json";
export default function AppPreferences(){
 const [theme,setTheme]=useSavedState<string>('badan:theme','system');
 const [native,setNative]=useState(false);
 const [message,setMessage]=useState('');
 const [busy,setBusy]=useState(false);
 useEffect(()=>{setNative(!!window.BadanNative);},[]);
 useEffect(()=>{const mq=matchMedia('(prefers-color-scheme: dark)');const sync=()=>{document.documentElement.dataset.theme=theme==='system'?(mq.matches?'dark':'light'):theme;};sync();mq.addEventListener('change',sync);return()=>mq.removeEventListener('change',sync);},[theme]);
 async function download(){
   if(!('serviceWorker' in navigator)||!('caches' in window)){setMessage('این مرورگر ذخیرهٔ آفلاین را پشتیبانی نمی‌کند. نسخهٔ APK را استفاده کن.');return;}
   setBusy(true);setMessage('آماده‌سازی آفلاین…');
   try {
     const cache=await caches.open('badan-offline-v6');
     const response=await fetch('/offline-assets.json');if(!response.ok)throw Error();
     const files:string[]=await response.json();
     for(let i=0;i<files.length;i++){if(!(await cache.match(files[i])))await cache.add(files[i]);setMessage(`ذخیرهٔ فایل ${i+1} از ${files.length}`);}
     storage.setItem('badan:offline-ready',new Date().toISOString());
     setMessage('برنامه و ویدیوها برای استفادهٔ آفلاین ذخیره شدند.');
   }catch{setMessage('دانلود کامل نشد؛ اتصال و فضای دستگاه را بررسی کن و دوباره بزن. فایل‌های دریافت‌شده حفظ شدند.');}finally{setBusy(false);}
 }
 return <section className="preferences-card"><h2>تنظیمات برنامه</h2><p className="field-label">ظاهر</p><div className="theme-options">{[['light','روشن'],['dark','شب'],['system','همراه گوشی']].map(([value,title])=><button key={value} aria-pressed={theme===value} onClick={()=>setTheme(value)}>{title}</button>)}</div><div className="offline-info"><strong>{native?'آفلاین آماده‌ست ✓':'برنامه همراهت می‌ماند'}</strong><p>{native?`برنامه و ${Object.keys(localVideos).length.toLocaleString('fa-IR')} ویدیوی حرکت داخل اپ هستند؛ بدون اینترنت هم کار می‌کنند.`:'برای مرورگر، یک‌بار برنامه و ویدیوها را دانلود کن؛ نسخهٔ APK از ابتدا آفلاین است.'}</p>{!native&&<button className="session-secondary" disabled={busy} onClick={download}>{busy?'در حال ذخیره…':'ذخیره برای استفادهٔ آفلاین'}</button>}<p role="status">{message}</p></div><p className="settings-privacy">سطح، هفته، پیشرفت، جلسهٔ نیمه‌کاره و تنظیمات روی همین دستگاه ذخیره می‌شوند. حذف اپ یا پاک کردن داده‌های آن، اطلاعات محلی را پاک می‌کند.</p></section>;
}
