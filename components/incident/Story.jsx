import { incident } from "@/content/incident";
import { profile } from "@/content/profile";
import { Facts, Label, Statement } from "../ui";
import { Reveal, FadeIn } from "../motion";
import { QueueLab } from "./QueueLab";
import { Pipeline } from "./Pipeline";

const MARKER = {
  fault: "text-fault",
  good: "text-sage",
  neutral: "text-faint",
};

const DOT = {
  fault: "bg-fault",
  good: "bg-sage",
  neutral: "bg-faint",
};

const METRIC = {
  good: "text-sage",
  ember: "text-ember",
};

const LAB_AFTER = "backpressure";

export function Story() {
  return (
    <article className="pb-24 pt-16 sm:pt-20">
      <a
        href="/"
        className="inline-flex items-center gap-2 text-[0.875rem] text-faint transition-colors duration-200 hover:text-sage"
      >
        <span aria-hidden="true">←</span>
        Back to the rest of the work
      </a>

      <header className="mt-12">
        <Label>{incident.eyebrow}</Label>

        <h1 className="text-display mt-6 text-[clamp(2.4rem,5.6vw,4rem)]">
          {incident.title}
        </h1>

        <p className="mt-8 text-[1.1875rem] leading-[1.65] text-dim">
          {incident.standfirst}
        </p>

        <Facts items={[incident.system, incident.stack]} className="mt-9" />
      </header>

      <FadeIn>
        <div className="card mt-16 p-6 sm:p-8">
          <Pipeline
            stages={profile.pipeline.stages}
            caption={profile.pipeline.caption}
          />
        </div>
      </FadeIn>

      <div className="mt-24">
        {incident.beats.map((beat) => (
          <div key={beat.id}>
            <Reveal>
              <section id={`beat-${beat.id}`} className="scroll-mt-28 pb-20">
                <div className="mb-5 flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className={`size-1.5 shrink-0 rounded-full ${DOT[beat.kind]}`}
                  />
                  <span
                    className={`text-[0.8125rem] font-medium ${MARKER[beat.kind]}`}
                  >
                    {beat.marker}
                  </span>
                </div>

                <h2 className="text-display mb-5 text-[clamp(1.5rem,2.6vw,2rem)]">
                  {beat.title}
                </h2>

                <Statement
                  text={beat.body}
                  className="leading-[1.75] text-dim"
                />

                {beat.pull ? (
                  <blockquote
                    className={`mt-10 border-l-2 pl-8 ${
                      beat.kind === "fault"
                        ? "border-fault-ghost"
                        : "border-sage-ghost"
                    }`}
                  >
                    <p
                      style={{ textWrap: "pretty" }}
                      className="text-display text-[clamp(1.3rem,2.2vw,1.7rem)] leading-[1.35] text-ink"
                    >
                      {beat.pull}
                    </p>
                  </blockquote>
                ) : null}

                {beat.note ? (
                  <p className="mt-8 rounded-card bg-sunk px-6 py-5 text-[0.9375rem] leading-[1.7] text-dim">
                    {beat.note}
                  </p>
                ) : null}
              </section>
            </Reveal>

            {beat.id === LAB_AFTER ? (
              <div className="pb-24">
                <Label>Try it</Label>
                <p className="mt-4 text-[0.9375rem] leading-[1.7] text-dim">
                  Four workers, more requests than they can serve. Change the
                  policy and the queue depth, and watch which lie each
                  combination tells you.
                </p>
                <QueueLab />
              </div>
            ) : null}
          </div>
        ))}
      </div>

      <Reveal>
        <div className="card p-8 sm:p-10">
          <Label>{incident.outcome.marker}</Label>

          <div className="mt-9 grid grid-cols-2 gap-x-8 gap-y-9 sm:grid-cols-4">
            {incident.outcome.metrics.map((metric) => (
              <div key={metric.label}>
                <span
                  className={`text-display tnum block text-[clamp(1.6rem,2.6vw,2.1rem)] ${METRIC[metric.kind]}`}
                >
                  {metric.value}
                </span>
                <span className="mt-2 block text-[0.8125rem] text-faint">
                  {metric.label}
                </span>
              </div>
            ))}
          </div>

          <p className="mt-12 border-t border-line-soft pt-8 leading-[1.7] text-dim">
            {incident.outcome.coda}
          </p>
        </div>
      </Reveal>
    </article>
  );
}
