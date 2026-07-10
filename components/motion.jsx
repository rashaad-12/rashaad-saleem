"use client";

import { m, useReducedMotion } from "motion/react";

const EASE = [0.22, 0.61, 0.24, 1];

export function Reveal({ children, index = 0, className = "" }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15, margin: "0px 0px -8% 0px" }}
      transition={{
        duration: 0.7,
        delay: Math.min(index, 5) * 0.08,
        ease: EASE,
      }}
    >
      {children}
    </m.div>
  );
}

export function HeroHeading({ lines, accent }) {
  const reduce = useReducedMotion();

  return (
    <h1 className="text-display text-[clamp(2.6rem,6.6vw,4.4rem)] leading-[1.08]">
      {lines.map((line, i) => (
        <span key={line} className="block overflow-hidden py-[0.06em]">
          {reduce ? (
            <Line line={line} accent={i === accent} />
          ) : (
            <m.span
              className="block"
              initial={{ y: "105%" }}
              animate={{ y: 0 }}
              transition={{
                duration: 0.86,
                delay: 0.08 + i * 0.11,
                ease: EASE,
              }}
            >
              <Line line={line} accent={i === accent} />
            </m.span>
          )}
        </span>
      ))}
    </h1>
  );
}

function Line({ line, accent }) {
  return <span className={`block ${accent ? "text-sage" : ""}`}>{line}</span>;
}

export function FadeIn({ children, delay = 0.55 }) {
  const reduce = useReducedMotion();
  if (reduce) return children;

  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7, delay }}
    >
      {children}
    </m.div>
  );
}
