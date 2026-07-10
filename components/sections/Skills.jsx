import { skills } from "@/content/skills";
import { SectionHead } from "../ui";
import { Reveal } from "../motion";

export function Skills() {
  return (
    <section id="skills" className="scroll-mt-28 py-24">
      <SectionHead
        eyebrow="Qualified, not rated"
        title="Skills"
        note="Ordered by how much of the day each one takes. Every entry says how it was earned."
      />

      <div className="flex flex-col gap-12">
        {skills.map((group, i) => (
          <Reveal key={group.title} index={i}>
            <div className="mb-2 flex items-baseline gap-4">
              <h3
                className={
                  group.lead
                    ? "text-[0.9375rem] font-semibold text-ink"
                    : "text-[0.9375rem] font-medium text-dim"
                }
              >
                {group.title}
              </h3>
              {group.lead ? (
                <span className="ml-auto rounded-pill bg-sage-ghost px-2.5 py-1 text-[0.75rem] font-medium text-sage">
                  Core
                </span>
              ) : null}
            </div>

            <ul className="flex list-none flex-col p-0">
              {group.items.map(([name, earned]) => (
                <li key={name} className="row">
                  <span
                    className={
                      group.lead
                        ? "text-[1.0625rem] font-medium text-ink"
                        : "text-[0.9375rem] text-dim"
                    }
                  >
                    {name}
                  </span>

                  <span className="tnum shrink-0 text-[0.8125rem] text-faint">
                    {earned}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
