import { recommendations } from "@/content/recommendations";
import { SectionHead } from "../ui";
import { Reveal } from "../motion";

const initialsOf = (name) =>
  name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");

export function Recommendations() {
  return (
    <section id="recommendations" className="scroll-mt-28 py-24">
      <SectionHead
        eyebrow="References"
        title="What the people I worked with say"
        note="From colleagues at WiseTech Global, published on LinkedIn."
      />

      <div className="grid gap-6 md:grid-cols-2">
        {recommendations.map((rec, i) => (
          <Reveal key={rec.name} index={i} className="h-full">
            <figure className="card m-0 flex h-full flex-col gap-6 overflow-hidden p-8">
              <span
                aria-hidden="true"
                className="text-display pointer-events-none absolute right-5 top-1 select-none text-[4rem] leading-none text-sage-ghost"
              >
                &ldquo;
              </span>

              <blockquote className="relative flex-1">
                <p className="text-[0.9375rem] italic leading-relaxed text-dim">
                  {rec.quote}
                </p>
              </blockquote>

              <figcaption className="flex items-center gap-3 border-t border-line-soft pt-5">
                <span
                  aria-hidden="true"
                  className="text-display grid size-10 shrink-0 place-items-center rounded-full bg-sage-ghost text-[0.875rem] text-sage ring-1 ring-line"
                >
                  {initialsOf(rec.name)}
                </span>

                <span className="min-w-0">
                  <span className="block text-[0.9375rem] font-semibold leading-tight">
                    {rec.name}
                  </span>
                  <span className="mt-1 block text-[0.8125rem] leading-tight text-faint">
                    {rec.title}
                  </span>
                </span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
