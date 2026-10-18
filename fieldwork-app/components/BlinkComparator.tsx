"use client";

import { useEffect, useState } from "react";
import { Pause, Play } from "lucide-react";
import styles from "./BlinkComparator.module.css";

/* Blink comparator: the two crops share one spot and flick every 600 ms, so a changed spot jumps out. Tap to pause. */
export function BlinkComparator({ listingSrc, unboxSrc }: { listingSrc: string; unboxSrc: string }) {
  const [showUnbox, setShowUnbox] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) setPaused(true);
  }, []);
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setShowUnbox((v) => !v), 600);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <button
      type="button"
      className={styles.box}
      onClick={() => (paused ? setShowUnbox((v) => !v) : setPaused(true))}
      aria-label={paused ? "Flicker paused. Tap to switch between listing and unboxing" : "Tap to pause the flicker"}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={listingSrc} alt="Listing crop of the changed spot" className={styles.img} data-on={!showUnbox} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={unboxSrc} alt="Unboxing crop of the same spot" className={styles.img} data-on={showUnbox} />
      <span className={`${styles.label} t-meta`}>{showUnbox ? "Unboxing" : "Listing"}</span>
      <span className={`${styles.hint} t-meta`}>
        {paused ? <Play size={12} aria-hidden="true" /> : <Pause size={12} aria-hidden="true" />}
        {paused ? "Paused · tap to switch" : "Tap to pause"}
      </span>
    </button>
  );
}
