"use client";

import { useEffect, useRef, useState } from "react";
import { SECTIONS } from "@/content/sections";

const WIDTH = 40;
const SAMPLES = 240;
const SWING = 13;

const readingLine = () => window.scrollY + window.innerHeight * 0.35;

const curveFor = (h) => {
  const mid = WIDTH / 2;
  const right = mid + SWING;
  const left = mid - SWING;
  return [
    `M ${mid} 0`,
    `C ${right} ${h * 0.11}, ${left} ${h * 0.19}, ${mid} ${h * 0.3}`,
    `S ${right} ${h * 0.43}, ${mid} ${h * 0.54}`,
    `S ${left} ${h * 0.67}, ${mid} ${h * 0.78}`,
    `S ${right} ${h * 0.9}, ${mid} ${h}`,
  ].join(" ");
};

export function Thread() {
  const navRef = useRef(null);
  const pathRef = useRef(null);
  const curveRef = useRef([]);

  const [height, setHeight] = useState(0);
  const [total, setTotal] = useState(0);
  const [inked, setInked] = useState(0);
  const [marks, setMarks] = useState([]);
  const [active, setActive] = useState(SECTIONS[0].id);
  const [retired, setRetired] = useState(false);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const ro = new ResizeObserver(([entry]) =>
      setHeight(entry.contentRect.height),
    );
    ro.observe(nav);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const footer = document.getElementById("site-footer");
    if (!footer) return;

    const io = new IntersectionObserver(
      ([entry]) => setRetired(entry.isIntersecting),
      {
        threshold: 0,
      },
    );
    io.observe(footer);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const path = pathRef.current;
    if (!path || height <= 0) return;

    let raf = 0;

    const length = path.getTotalLength();
    setTotal(length);
    curveRef.current = Array.from({ length: SAMPLES + 1 }, (_, i) => {
      const at = (length * i) / SAMPLES;
      const point = path.getPointAtLength(at);
      return { at, x: point.x, y: point.y };
    });

    const sampleAtY = (targetY) => {
      let best = curveRef.current[0];
      let bestGap = Infinity;

      for (const sample of curveRef.current) {
        const gap = Math.abs(sample.y - targetY);
        if (gap < bestGap) {
          bestGap = gap;
          best = sample;
        }
      }
      return best;
    };

    const toRailY = (docY) => {
      const docHeight = document.documentElement.scrollHeight;
      if (docHeight <= 0) return 0;
      return Math.max(0, Math.min(height, (docY / docHeight) * height));
    };

    const measure = () => {
      setMarks(
        SECTIONS.map(({ id, label }) => {
          const el = document.getElementById(id);
          const top = el ? el.getBoundingClientRect().top + window.scrollY : 0;
          const { x, y } = sampleAtY(toRailY(top));
          return { id, label, x, y };
        }),
      );
    };

    const read = () => {
      const line = readingLine();
      setInked(sampleAtY(toRailY(line)).at);

      let current = SECTIONS[0].id;
      for (const { id } of SECTIONS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top + window.scrollY <= line)
          current = id;
      }
      setActive(current);
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(read);
    };

    const onResize = () => {
      measure();
      read();
    };

    measure();
    read();

    window.addEventListener("scroll", onScroll, { passive: true });
    const ro = new ResizeObserver(onResize);
    ro.observe(document.body);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      ro.disconnect();
    };
  }, [height]);

  const d = height > 0 ? curveFor(height) : "";

  return (
    <nav
      ref={navRef}
      aria-label="Sections"
      aria-hidden={retired ? "true" : undefined}
      className={`fixed bottom-16 top-32 z-30 hidden w-10 transition-opacity duration-500 min-[1340px]:block ${
        retired ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      style={{ left: "calc(50% - 544px)" }}
    >
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full overflow-visible"
        fill="none"
      >
        <path
          ref={pathRef}
          d={d}
          stroke="var(--color-line)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d={d}
          stroke="var(--color-sage)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray={total}
          strokeDashoffset={total - inked}
          style={{ transition: "stroke-dashoffset 140ms linear" }}
        />
      </svg>

      {marks.map((mark) => {
        const isActive = mark.id === active;
        return (
          <a
            key={mark.id}
            href={`#${mark.id}`}
            aria-current={isActive ? "true" : undefined}
            className="group absolute flex -translate-x-1/2 -translate-y-1/2 items-center"
            style={{ left: `${mark.x}px`, top: `${mark.y}px` }}
          >
            <span className="absolute right-4 whitespace-nowrap text-right">
              <span
                className={`text-[0.8125rem] transition-colors duration-300 ${
                  isActive
                    ? "font-medium text-ink"
                    : "text-faint group-hover:text-dim"
                }`}
              >
                {mark.label}
              </span>
            </span>

            <span
              aria-hidden="true"
              className={`size-2.25 rounded-full transition-all duration-300 ${
                isActive
                  ? "scale-110 bg-sage ring-4 ring-sage-ghost"
                  : "bg-sunk ring-1 ring-line group-hover:bg-faint"
              }`}
            />
          </a>
        );
      })}
    </nav>
  );
}
