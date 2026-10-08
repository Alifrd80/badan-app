"use client";
import { useCallback, useSyncExternalStore } from "react";
import type { LevelKey } from "@/lib/types";
import { storage } from "./storage";
import { validProfile } from "./assessment";
function subscribe(fn: () => void) { window.addEventListener('badan-storage',fn); window.addEventListener('storage',fn); return () => {window.removeEventListener('badan-storage',fn);window.removeEventListener('storage',fn);}; }
function useRaw(key: string, fallback: string) { return useSyncExternalStore(subscribe,()=>{try{return storage.getItem(key)??fallback;}catch{return fallback;}},()=>fallback); }
function parse(raw: string) { try{return JSON.parse(raw);}catch{return null;} }
export function useSettings() {
 const p=parse(useRaw('badan:profile','null'));
 const raw=useRaw('badan:level','beginner');
 const level:LevelKey=validProfile(p)?p.level:raw==='professional'||raw==='intermediate'?raw:'beginner';
 const saved=Number(useRaw('badan:week','1'));
 const week=Number.isInteger(saved)&&saved>=1&&saved<=13?saved:1;
 const changeWeek=useCallback((w:number)=>{if(Number.isInteger(w)&&w>=1&&w<=13)storage.setItem('badan:week',String(w));},[]);
 return {level,week,changeWeek};
}
interface DoneDay { [index:number]:boolean; abs?:boolean }
type DoneSet=Record<string,DoneDay>;
function loadDone():DoneSet {try{const x=parse(storage.getItem('badan:done')??'{}');return x&&typeof x==='object'&&!Array.isArray(x)?x:{};}catch{return {};}}
export function useProgress(level:LevelKey) {
 const raw=useRaw('badan:done','{}'); const parsed=parse(raw);const done:DoneSet=parsed&&typeof parsed==='object'&&!Array.isArray(parsed)?parsed:{};
 const dayKey=useCallback((week:number,day:string)=>`${level}:${week}:${day}`,[level]);
 const toggleItem=useCallback((week:number,day:string,index:number,value?:boolean)=>{const all=loadDone(),key=dayKey(week,day);all[key]={...all[key],[index]:value??!all[key]?.[index]};storage.setItem('badan:done',JSON.stringify(all));},[dayKey]);
 const markDayAbs=useCallback((week:number,day:string,value:boolean)=>{const all=loadDone(),key=dayKey(week,day);all[key]={...all[key],abs:value};storage.setItem('badan:done',JSON.stringify(all));},[dayKey]);
 const resetDay=useCallback((week:number,day:string)=>{const all=loadDone();delete all[dayKey(week,day)];storage.setItem('badan:done',JSON.stringify(all));},[dayKey]);
 return {done,toggleItem,markDayAbs,resetDay,isDone:(week:number,day:string,index:number)=>done[dayKey(week,day)]?.[index]===true,isAbsDone:(week:number,day:string)=>done[dayKey(week,day)]?.abs===true};
}
export function totalItemSets(e:{sets:number;alt?:{sets:number}}){return e.sets;}
