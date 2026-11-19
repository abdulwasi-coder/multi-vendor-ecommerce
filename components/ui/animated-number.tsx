"use client";

import { useEffect, useMemo, useState } from "react";

interface AnimatedNumberProps {
  value: number;
  currency?: string;
  maximumFractionDigits?: number;
  duration?: number;
}

export function AnimatedNumber({
  value,
  currency,
  maximumFractionDigits,
  duration = 850,
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const formatter = useMemo(
    () => {
      const fractionOptions = maximumFractionDigits === undefined
        ? {}
        : { maximumFractionDigits };
      const options: Intl.NumberFormatOptions = currency
        ? { style: "currency", currency, ...fractionOptions }
        : fractionOptions;
      return new Intl.NumberFormat("en-US", options);
    },
    [currency, maximumFractionDigits],
  );

  useEffect(() => {
    const target = Number.isFinite(value) ? value : 0;
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionPreference.matches || duration <= 0) {
      setDisplayValue(target);
      return;
    }

    let frame = 0;
    let startTime: number | undefined;
    setDisplayValue(0);

    const animate = (time: number) => {
      startTime ??= time;
      const progress = Math.min((time - startTime) / duration, 1);
      const easedProgress = 1 - (1 - progress) ** 3;
      setDisplayValue(target * easedProgress);
      if (progress < 1) frame = window.requestAnimationFrame(animate);
    };

    frame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frame);
  }, [duration, value]);

  return (
    <span aria-label={formatter.format(value)} aria-live="off">
      {formatter.format(displayValue)}
    </span>
  );
}
