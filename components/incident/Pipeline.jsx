"use client";

import { useEffect, useRef, useState } from "react";

const NODES = [0.05, 0.25, 0.75, 0.95];
const LANES = [-58, -20, 20, 58];
const SPAWN_PER_SEC = 13;
const MAX_PARTICLES = 150;
const SPEED = 0.19;

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smoothstep = (a, b, t) => {
  const x = clamp01((t - a) / (b - a));
  return x * x * (3 - 2 * x);
};

function laneOffset(p) {
  if (p <= NODES[1] || p >= NODES[2]) return 0;
  const t = (p - NODES[1]) / (NODES[2] - NODES[1]);
  return smoothstep(0, 0.24, t) * (1 - smoothstep(0.76, 1, t));
}

function readTokens() {
  const cs = getComputedStyle(document.documentElement);
  const v = (name) => cs.getPropertyValue(name).trim();
  return {
    sage: v("--color-sage"),
    ember: v("--color-ember"),
    line: v("--color-line"),
    faint: v("--color-faint"),
    lift: v("--color-lift"),
  };
}

export function Pipeline({ stages, caption }) {
  const canvasRef = useRef(null);
  const [stats, setStats] = useState({ processed: 0, p95: null });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    let tokens = readTokens();
    let w = 0;
    let h = 0;
    let raf = 0;
    let last = 0;
    let spawnAcc = 0;
    let visible = true;
    let running = false;

    const particles = [];
    const rings = [];
    const transits = [];
    let processed = 0;
    let statsAcc = 0;

    const yc = () => h / 2;
    const laneScale = () => Math.min(1, h / 200) * Math.min(1, w / 620);
    const xy = (p, lane) => ({
      x: p * w,
      y: yc() + LANES[lane] * laneScale() * laneOffset(p),
    });

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function drawTrack() {
      ctx.strokeStyle = tokens.line;
      ctx.lineWidth = 1.5;
      ctx.lineCap = "round";

      ctx.beginPath();
      ctx.moveTo(NODES[0] * w, yc());
      ctx.lineTo(NODES[1] * w, yc());
      ctx.moveTo(NODES[2] * w, yc());
      ctx.lineTo(NODES[3] * w, yc());
      ctx.stroke();

      for (let lane = 0; lane < LANES.length; lane++) {
        ctx.beginPath();
        for (let i = 0; i <= 60; i++) {
          const p = NODES[1] + ((NODES[2] - NODES[1]) * i) / 60;
          const { x, y } = xy(p, lane);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      for (const p of NODES) {
        ctx.beginPath();
        ctx.arc(p * w, yc(), 4, 0, Math.PI * 2);
        ctx.fillStyle = tokens.lift;
        ctx.fill();
        ctx.strokeStyle = tokens.faint;
        ctx.stroke();
      }
    }

    function drawParticle(part) {
      const head = xy(part.p, part.lane);
      const tailP = Math.max(NODES[0], part.p - 0.035);

      const grad = ctx.createLinearGradient(tailP * w, head.y, head.x, head.y);
      grad.addColorStop(0, "transparent");
      grad.addColorStop(1, tokens.sage);

      ctx.beginPath();
      for (let i = 0; i <= 6; i++) {
        const p = tailP + ((part.p - tailP) * i) / 6;
        const { x, y } = xy(p, part.lane);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(head.x, head.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = tokens.sage;
      ctx.fill();
    }

    function spawn(now) {
      if (particles.length >= MAX_PARTICLES) return;
      particles.push({
        p: NODES[0],
        lane: (Math.random() * LANES.length) | 0,
        born: now,
        jitter: 0.85 + Math.random() * 0.3,
      });
    }

    function step(now) {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      spawnAcc += dt * SPAWN_PER_SEC;
      while (spawnAcc >= 1) {
        spawn(now);
        spawnAcc -= 1;
      }

      ctx.clearRect(0, 0, w, h);
      drawTrack();

      for (let i = particles.length - 1; i >= 0; i--) {
        const part = particles[i];
        part.p += SPEED * part.jitter * dt;

        if (part.p >= NODES[3]) {
          particles.splice(i, 1);
          processed += 1;
          transits.push(now - part.born);
          if (transits.length > 120) transits.shift();
          rings.push({ born: now });
          continue;
        }
        drawParticle(part);
      }

      for (let i = rings.length - 1; i >= 0; i--) {
        const age = (now - rings[i].born) / 620;
        if (age >= 1) {
          rings.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(NODES[3] * w, yc(), 4 + age * 14, 0, Math.PI * 2);
        ctx.strokeStyle = tokens.ember;
        ctx.globalAlpha = 1 - age;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      statsAcc += dt;
      if (statsAcc > 0.4) {
        statsAcc = 0;
        let p95 = null;
        if (transits.length > 12) {
          const sorted = [...transits].sort((a, b) => a - b);
          p95 =
            sorted[
              Math.min(sorted.length - 1, Math.floor(sorted.length * 0.95))
            ];
        }
        setStats({ processed, p95 });
      }

      raf = requestAnimationFrame(step);
    }

    function drawStatic() {
      ctx.clearRect(0, 0, w, h);
      drawTrack();
      for (let i = 0; i < 16; i++) {
        drawParticle({
          p: NODES[0] + (i / 16) * (NODES[3] - NODES[0]),
          lane: i % LANES.length,
        });
      }
      setStats({ processed: 0, p95: null });
    }

    function start() {
      if (running || reduce.matches || !visible) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(step);
    }

    function stop() {
      running = false;
      cancelAnimationFrame(raf);
    }

    function render() {
      resize();
      if (reduce.matches) {
        stop();
        drawStatic();
      } else if (visible) {
        stop();
        start();
      }
    }

    const ro = new ResizeObserver(render);
    ro.observe(canvas);

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
        else stop();
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    const onTheme = () => {
      tokens = readTokens();
      if (reduce.matches) drawStatic();
    };
    const mo = new MutationObserver(onTheme);
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    const onVisibility = () => {
      if (document.hidden) stop();
      else if (visible) start();
    };
    document.addEventListener("visibilitychange", onVisibility);
    reduce.addEventListener("change", render);

    render();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      reduce.removeEventListener("change", render);
    };
  }, []);

  return (
    <div className="relative">
      <div className="relative h-50 w-full sm:h-60">
        <div className="absolute inset-0">
          <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="block h-full w-full"
          />
        </div>

        <ol className="sr-only">
          {stages.map((stage) => (
            <li key={stage}>{stage}</li>
          ))}
        </ol>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          {stages.map((stage, i) => (
            <span
              key={stage}
              className="absolute whitespace-nowrap text-[0.75rem] text-faint sm:text-[0.8125rem]"
              style={{
                left: `${NODES[i] * 100}%`,
                top: "50%",
                transform: "translate(-50%, 20px)",
              }}
            >
              {stage}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-baseline gap-x-7 gap-y-2 border-t border-line-soft pt-5">
        <Gauge
          label="processed"
          value={stats.processed.toLocaleString()}
          tone="text-ember"
        />
        <Gauge
          label="p95 transit"
          value={stats.p95 ? `${(stats.p95 / 1000).toFixed(2)} s` : "—"}
          tone="text-ink"
        />
        <Gauge label="workers" value="4 / 4" tone="text-dim" />
        <p className="ml-auto max-w-[30ch] text-[0.75rem] leading-relaxed text-faint">
          {caption}
        </p>
      </div>
    </div>
  );
}

function Gauge({ label, value, tone }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="text-[0.8125rem] text-faint">{label}</span>
      <span className={`readout tnum text-[0.875rem] font-medium ${tone}`}>
        {value}
      </span>
    </div>
  );
}
