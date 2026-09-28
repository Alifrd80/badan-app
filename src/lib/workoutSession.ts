export type Phase = "ready" | "work" | "rest" | "finished";
export interface SessionStep {
  key: string;
  group: string;
  id: string;
  label: string;
  prescription: string;
  set: number;
  sets: number;
  reps?: number | null;
  seconds?: number;
  note?: string;
  eachSide?: boolean;
  holdTop?: boolean;
  restAfter: number;
}
export interface SessionState {
  cursor: number;
  phase: Phase;
  remaining: number;
  paused: boolean;
  completed: string[];
  elapsed: number;
}
export type SessionAction =
  | { type: "tick"; seconds: number }
  | { type: "toggle" }
  | { type: "pause" }
  | { type: "advance" }
  | { type: "skip" }
  | { type: "previous" }
  | { type: "addRest"; seconds: number };
export const initialSession = (cursor = 0): SessionState => ({ cursor, phase: "ready", remaining: 10, paused: false, completed: [], elapsed: 0 });
function enterWork(state: SessionState, steps: SessionStep[]): SessionState {
  return { ...state, phase: "work", remaining: steps[state.cursor]?.seconds ?? 0, paused: false };
}
function finishStep(state: SessionState, steps: SessionStep[], completed: boolean): SessionState {
  const step = steps[state.cursor];
  const done = completed ? Array.from(new Set([...state.completed, step.key])) : state.completed;
  if (state.cursor >= steps.length - 1) return { ...state, completed: done, phase: "finished", remaining: 0, paused: true };
  const next = { ...state, cursor: state.cursor + 1, completed: done, paused: false };
  return completed && step.restAfter > 0
    ? { ...next, phase: "rest", remaining: step.restAfter }
    : enterWork(next, steps);
}
export function sessionReducer(state: SessionState, action: SessionAction, steps: SessionStep[]): SessionState {
  if (!steps.length || state.phase === "finished") return state;
  if (action.type === "pause") return { ...state, paused: true };
  if (action.type === "toggle") return { ...state, paused: !state.paused };
  if (action.type === "addRest") return state.phase === "rest" ? { ...state, remaining: state.remaining + action.seconds } : state;
  if (action.type === "previous") return state.cursor > 0 ? enterWork({ ...state, cursor: state.cursor - 1 }, steps) : state;
  if (action.type === "skip") return state.phase === "work" ? finishStep(state, steps, false) : enterWork(state, steps);
  if (action.type === "advance") return state.phase === "work" ? finishStep(state, steps, true) : enterWork(state, steps);
  if (action.type === "tick" && !state.paused) {
    const elapsed = state.elapsed + action.seconds;
    if (state.phase === "work" && !steps[state.cursor].seconds) return { ...state, elapsed };
    const remaining = Math.max(0, state.remaining - action.seconds);
    const updated = { ...state, elapsed, remaining };
    if (remaining > 0) return updated;
    return state.phase === "work" ? finishStep(updated, steps, true) : enterWork(updated, steps);
  }
  return state;
}
export function restoreSession(raw: string | null, signature: string, steps: SessionStep[]): SessionState | null {
  try {
    const saved = JSON.parse(raw ?? "null");
    const s = saved?.state;
    if (saved?.signature !== signature || !s || !Number.isInteger(s.cursor) || s.cursor < 0 || s.cursor >= steps.length || !["ready","work","rest"].includes(s.phase) || !Number.isFinite(s.remaining) || s.remaining < 0 || !Number.isFinite(s.elapsed) || s.elapsed < 0 || !Array.isArray(s.completed) || !s.completed.every((key: unknown) => typeof key === "string" && steps.some(step => step.key === key))) return null;
    return { ...s, paused: true };
  } catch { return null; }
}
export function completedGroups(state: SessionState, steps: SessionStep[]): string[] {
  return [...new Set(steps.map(step => step.group))].filter(group => steps.filter(step => step.group === group).every(step => state.completed.includes(step.key)));
}
