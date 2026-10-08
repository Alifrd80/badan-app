"use client";
import ExerciseVideo from "./ExerciseVideo";
export default function VideoEmbed({id,fa}:{id:string;fa?:string}){return <ExerciseVideo id={id} label={fa??"حرکت"}/>;}
