import { approach } from "@/content/approach";
import { SectionHead } from "../ui";
import { Reveal } from "../motion";

export function Approach() {
  return (
    <section id="approach" className="scroll-mt-28 py-24">
      <SectionHead
        eyebrow={approach.eyebrow}
        title={approach.title}
        note={approach.note}
      />

      <div className="flex flex-col gap-11">
        {approach.tenets.map((tenet, i) => (
          <Reveal key={tenet.title} index={i}>
            <div className="border-l-2 border-sage-ghost pl-7">
              <h3 className="text-display mb-4 text-[1.4rem] leading-[1.28]">
                {tenet.title}
              </h3>

              <p className="leading-[1.75] text-dim">{tenet.body}</p>

              <a
                href={tenet.anchor}
                className="mt-5 inline-flex items-center gap-2 text-[0.875rem] text-faint transition-colors duration-200 hover:text-sage"
              >
                <span aria-hidden="true">↗</span>
                <span className="underline decoration-current/25 underline-offset-[5px]">
                  {tenet.anchorLabel}
                </span>
              </a>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
