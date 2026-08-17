"use client";

import { useEffect, useState } from "react";

const PHRASES = [
  "SEO y Automatización con IA",
  "para Empresas",
  "que generan resultados",
  "que impulsan tu negocio",
];

const TYPE_SPEED = 65;
const ERASE_SPEED = 30;
const HOLD_TIME = 2200;
const PAUSE_BETWEEN = 300;

type Phase = "typing" | "holding" | "erasing" | "paused";
type State = { phraseIndex: number; display: string; phase: Phase };

function step(state: State): { next: State; delay: number } {
  const current = PHRASES[state.phraseIndex];
  if (state.phase === "typing") {
    if (state.display.length < current.length) {
      return { next: { ...state, display: current.slice(0, state.display.length + 1) }, delay: TYPE_SPEED };
    }
    return { next: { ...state, phase: "holding" }, delay: 100 };
  }
  if (state.phase === "holding") {
    return { next: { ...state, phase: "erasing" }, delay: HOLD_TIME };
  }
  if (state.phase === "erasing") {
    if (state.display.length > 0) {
      return { next: { ...state, display: current.slice(0, state.display.length - 1) }, delay: ERASE_SPEED };
    }
    return { next: { ...state, phase: "paused" }, delay: 50 };
  }
  return { next: { phraseIndex: (state.phraseIndex + 1) % PHRASES.length, display: "", phase: "typing" }, delay: PAUSE_BETWEEN };
}

export function RotatingScrambleText({ className }: { className?: string }) {
  const [state, setState] = useState<State>({ phraseIndex: 0, display: "", phase: "typing" });

  useEffect(() => {
    const { next, delay } = step(state);
    const id = setTimeout(() => setState(next), delay);
    return () => clearTimeout(id);
  }, [state]);

  return (
    <span className={className} aria-label={PHRASES[state.phraseIndex]}>
      <span className="sr-only">{PHRASES[state.phraseIndex]}</span>
      <span aria-hidden>
        {state.display}
        <span className="ml-0.5 inline-block animate-pulse bg-current align-middle" style={{ width: "3px", height: "0.9em" }} />
      </span>
    </span>
  );
}
