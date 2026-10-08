"use client";
import {useEffect} from "react";
import basePath from "@/lib/basePath";
export default function SWRegister(){useEffect(()=>{if(window.BadanNative||process.env.NODE_ENV!=="production"||!("serviceWorker" in navigator))return;const hadController=!!navigator.serviceWorker.controller;let refreshed=false;const changed=()=>{if(hadController&&!refreshed){refreshed=true;location.reload();}};navigator.serviceWorker.addEventListener('controllerchange',changed);navigator.serviceWorker.register(`${basePath}/sw.js`).catch(()=>{});return()=>navigator.serviceWorker.removeEventListener('controllerchange',changed);},[]);return null;}
