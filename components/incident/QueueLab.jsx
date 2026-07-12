"use client";

import { useEffect, useRef, useState } from "react";

const WORKERS = 4;
const TASK_MS = 800;
const TASK_MS_FIXED = 400;
const DISPATCH_MS = 24;
const ARRIVAL_PER_SEC = 8;
const SERVICE_PER_SEC = WORKERS / (TASK_MS / 1000);
const SERVICE_FIXED = WORKERS / (TASK_MS_FIXED / 1000);
const TIMEOUT_MS = 3000;
const SIM_SPEED = 16;
const MAX_PENDING = 400;

const VERDICTS = {
  "caller-runs:500": {
    tone: "fault",
    text: "What production actually ran. Give it a moment: while the queue has room nothing looks wrong at all. Then it fills, the request thread starts executing batches and the lag settles a hundred seconds deep. Throughput never drops. That is exactly why nobody suspected the pool.",
  },
  "caller-runs:30": {
    tone: "fault",
    text: "The same bug with the disguise off. Within seconds the request thread is spending almost all its time running batches. Look at the accept rate: it is fine. CallerRuns raises throughput, because the thread that should be answering clients is doing real work instead. That is the seduction and that is the outage that follows it.",
  },
  "block:500": {
    tone: "ember",
    text: "Nothing is stolen now. The request thread only ever dispatches. Nothing is on time either. Five hundred slots do not absorb load, they hide it: the backlog grows where no alert is pointed and by the time anyone feels it you are minutes behind.",
  },
  "block:30": {
    tone: "good",
    text: "The fix, whole. Request-thread-stolen sits at zero because the pool never hands a batch back to the caller and shed sits at zero too: once each task stopped firing N+1 queries, four workers clear the incoming load with room to spare. Nothing queues for long, nothing times out. The shallow queue is still there, ready to signal the moment load ever outruns the workers again.",
  },
};

const VERDICT_TONE = {
  fault: "text-fault",
  ember: "text-ember",
  good: "text-sage",
};

const WINDOW_MS = 5000;

const initialStats = {
  acceptRate: 0,
  stolen: 0,
  shed: 0,
  lag: 0,
  queue: 0,
  rt: "idle",
  workers: 0,
};

export function QueueLab() {
  const [policy, setPolicy] = useState("caller-runs");
  const [capacity, setCapacity] = useState(500);
  const [stats, setStats] = useState(initialStats);
  const [reduce, setReduce] = useState(false);

  const cfg = useRef({ policy, capacity });
  cfg.current = { policy, capacity };

  const pick = (setter) => (next) => {
    setStats(initialStats);
    setter(next);
  };

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduce(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (reduce) return;

    const fixed = policy === "block" && capacity === 30;
    const taskMs = fixed ? TASK_MS_FIXED : TASK_MS;
    const servicePerSec = fixed ? SERVICE_FIXED : SERVICE_PER_SEC;

    let raf = 0;
    let last = performance.now();
    let visible = true;
    let acc = 0;
    let arrivalAcc = 0;

    const pending = [];
    const queue = [];
    const workers = Array.from({ length: WORKERS }, () => 0);
    const rt = { remaining: 0, mode: "idle" };
    const acceptTimes = [];
    const cancelTimes = [];
    let stolenMs = 0;
    let totalMs = 0;

    function tick(dtMs, now) {
      arrivalAcc += (dtMs / 1000) * ARRIVAL_PER_SEC;
      while (arrivalAcc >= 1) {
        if (pending.length < MAX_PENDING) pending.push(now);
        arrivalAcc -= 1;
      }

      for (let i = 0; i < workers.length; i++) {
        let wb = dtMs;
        while (wb > 0) {
          if (workers[i] > 0) {
            const spend = Math.min(workers[i], wb);
            workers[i] -= spend;
            wb -= spend;
            if (workers[i] > 0) break;
          }
          if (!queue.length) break;
          queue.shift();
          workers[i] = taskMs;
        }
      }

      let budget = dtMs;
      let stolenThisTick = 0;
      while (budget > 0) {
        if (rt.remaining > 0) {
          const spend = Math.min(rt.remaining, budget);
          if (rt.mode === "running-batch") stolenThisTick += spend;
          rt.remaining -= spend;
          budget -= spend;
          if (rt.remaining > 0) break;
          rt.mode = "idle";
        }

        if (!pending.length) {
          rt.mode = "idle";
          break;
        }

        const { capacity: cap, policy: pol } = cfg.current;
        if (queue.length < cap) {
          pending.shift();
          queue.push(now);
          acceptTimes.push(now);
          rt.remaining = DISPATCH_MS;
          rt.mode = "dispatching";
        } else if (pol === "caller-runs") {
          pending.shift();
          acceptTimes.push(now);
          rt.remaining = taskMs;
          rt.mode = "running-batch";
        } else {
          rt.mode = "blocked";
          break;
        }
      }

      for (let i = pending.length - 1; i >= 0; i--) {
        if (now - pending[i] > TIMEOUT_MS) {
          pending.splice(i, 1);
          cancelTimes.push(now);
        }
      }

      const decay = Math.exp(-dtMs / WINDOW_MS);
      totalMs = totalMs * decay + dtMs;
      stolenMs = stolenMs * decay + stolenThisTick;

      while (acceptTimes.length && now - acceptTimes[0] > WINDOW_MS)
        acceptTimes.shift();
      while (cancelTimes.length && now - cancelTimes[0] > WINDOW_MS)
        cancelTimes.shift();

      while (queue.length > cfg.current.capacity) queue.pop();
    }

    function frame(now) {
      const realDt = Math.min(now - last, 50);
      last = now;
      const dt = realDt * SIM_SPEED;
      tick(dt, now * SIM_SPEED);

      acc += realDt;
      if (acc > 100) {
        acc = 0;
        const admitted = acceptTimes.length;
        const dropped = cancelTimes.length;
        setStats({
          acceptRate: admitted / (WINDOW_MS / 1000),
          stolen: totalMs > 0 ? (stolenMs / totalMs) * 100 : 0,
          shed:
            admitted + dropped > 0 ? (dropped / (admitted + dropped)) * 100 : 0,
          lag: queue.length / servicePerSec,
          queue: queue.length,
          rt: rt.mode,
          workers: workers.filter((w) => w > 0).length,
        });
      }
      raf = requestAnimationFrame(frame);
    }

    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        cancelAnimationFrame(raf);
        if (visible) {
          last = performance.now();
          raf = requestAnimationFrame(frame);
        }
      },
      { threshold: 0 },
    );
    const node = document.getElementById("queue-lab");
    if (node) io.observe(node);

    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [reduce, policy, capacity]);

  const verdict = VERDICTS[`${policy}:${capacity}`];
  const fill = Math.min(100, (stats.queue / capacity) * 100);
  const fixed = policy === "block" && capacity === 30;

  return (
    <div id="queue-lab" className="card mt-9 overflow-hidden">
      <div className="flex flex-wrap items-center gap-x-8 gap-y-4 border-b border-line-soft px-6 py-5 sm:px-8">
        <Control
          label="saturation policy"
          value={policy}
          onChange={pick(setPolicy)}
          options={[
            ["caller-runs", "CallerRuns"],
            ["block", "block & signal"],
          ]}
        />
        <Control
          label="queue depth"
          value={capacity}
          onChange={pick(setCapacity)}
          options={[
            [500, "500"],
            [30, "30"],
          ]}
        />
        <p className="w-full text-[0.75rem] leading-relaxed text-faint sm:ml-auto sm:w-auto">
          8 requests/s arriving · 4 workers serving {fixed ? "10" : "5"}/s
          <br />
          {fixed
            ? "Load cleared: cheaper tasks, workers keep up."
            : "Permanently overloaded, on purpose."}
        </p>
      </div>

      <div className="px-6 py-7 sm:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-stretch sm:gap-5">
          <Stage label="request thread">
            <span
              className={`readout block truncate text-[0.75rem] transition-colors duration-200 ${
                stats.rt === "running-batch"
                  ? "text-fault"
                  : stats.rt === "blocked"
                    ? "text-ember"
                    : "text-dim"
              }`}
            >
              {reduce ? "idle" : stats.rt}
            </span>
          </Stage>

          <Stage label={`queue · cap ${capacity}`} grow>
            <div className="h-2.5 w-full overflow-hidden rounded-pill bg-sunk">
              <div
                className={`h-full rounded-pill transition-[width] duration-150 ease-linear ${
                  fill > 95 ? "bg-fault" : "bg-ember"
                }`}
                style={{ width: `${reduce ? 40 : fill}%` }}
              />
            </div>
            <span className="readout mt-2.5 block text-[0.75rem] text-faint">
              {reduce ? "—" : stats.queue.toLocaleString()} waiting
            </span>
          </Stage>

          <Stage label="workers">
            <div className="flex gap-1.5">
              {Array.from({ length: WORKERS }, (_, i) => (
                <span
                  key={i}
                  className={`size-2.5 rounded-full transition-colors duration-150 ${
                    (reduce ? WORKERS : stats.workers) > i
                      ? "bg-sage"
                      : "bg-sunk"
                  }`}
                />
              ))}
            </div>
          </Stage>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-line-soft pt-6 sm:grid-cols-4">
          <Metric
            label="accept rate"
            value={reduce ? "—" : `${stats.acceptRate.toFixed(1)}/s`}
            tone="text-sage"
            hint="requests the API took in"
          />
          <Metric
            label="request thread stolen"
            value={reduce ? "—" : `${stats.stolen.toFixed(0)}%`}
            tone={stats.stolen > 1 ? "text-fault" : "text-dim"}
            hint="time spent running batches instead of serving"
          />
          <Metric
            label="lag"
            value={reduce ? "—" : `${stats.lag.toFixed(1)} s`}
            tone={stats.lag > 20 ? "text-ember" : "text-dim"}
            hint="how far behind the queued work is"
          />
          <Metric
            label="shed"
            value={reduce ? "—" : `${stats.shed.toFixed(0)}%`}
            tone={stats.shed > 0 ? "text-ember" : "text-dim"}
            hint="arrivals that timed out waiting"
          />
        </div>

        <p
          aria-live="polite"
          className={`mt-8 text-[0.9375rem] leading-[1.7] ${VERDICT_TONE[verdict.tone]}`}
        >
          {verdict.text}
        </p>

        {reduce ? (
          <p className="mt-4 text-[0.8125rem] leading-relaxed text-faint">
            Motion is off, so the simulation is paused. Switch the controls to
            read each verdict.
          </p>
        ) : null}
      </div>
    </div>
  );
}

function Stage({ label, children, grow = false }) {
  return (
    <div className={grow ? "min-w-0 flex-1" : "min-w-0 shrink-0"}>
      <span className="mb-3 block text-[0.75rem] text-faint">{label}</span>
      {children}
    </div>
  );
}

function Metric({ label, value, tone, hint }) {
  return (
    <div>
      <span className="block text-[0.8125rem] leading-snug text-dim">
        {label}
      </span>
      <span
        className={`readout tnum mt-2 block text-[1.125rem] font-medium ${tone}`}
      >
        {value}
      </span>
      <span className="mt-1.5 block text-[0.75rem] leading-snug text-faint">
        {hint}
      </span>
    </div>
  );
}

function Control({ label, value, onChange, options }) {
  return (
    <fieldset className="min-w-0">
      <legend className="mb-2.5 text-[0.75rem] text-faint">{label}</legend>
      <div className="flex gap-1 rounded-pill bg-sunk p-1">
        {options.map(([key, text]) => (
          <button
            key={key}
            type="button"
            aria-pressed={value === key}
            onClick={() => onChange(key)}
            className={`rounded-pill px-3.5 py-1.5 text-[0.8125rem] transition-colors duration-200 ${
              value === key ? "bg-sage text-ground" : "text-dim hover:text-ink"
            }`}
          >
            {text}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
