import { experience } from "@/content/experience";
import { Facts, SectionHead, Statement } from "../ui";
import { Reveal } from "../motion";

export function Experience() {
  return (
    <section id="experience" className="scroll-mt-28 py-24">
      <SectionHead
        eyebrow="The record"
        title="Experience"
        note={experience.when}
      />

      <div className="card p-7 sm:p-9">
        <div className="mb-3 flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <h3 className="text-display text-[1.6rem]">{experience.org}</h3>
          <span className="text-[0.9375rem] text-faint">
            {experience.orgNote}
          </span>
        </div>

        <p className="mb-4 text-[0.875rem] text-sage">{experience.team}</p>

        <p className="text-[0.9375rem] leading-[1.7] text-dim">
          {experience.summary}
        </p>

        <Facts items={experience.scope} className="mt-7" />
      </div>

      <ol className="mt-16 flex list-none flex-col gap-14 border-l border-line-soft p-0 pl-9">
        {experience.roles.map((role, i) => (
          <li key={role.title}>
            <Reveal index={i}>
              <div className="relative mb-7 flex flex-wrap items-baseline gap-x-4">
                <span
                  aria-hidden="true"
                  className="absolute -left-10.25 top-2 size-2.5 rounded-full bg-sage ring-4 ring-ground"
                />
                <h3 className="text-[1.125rem] font-semibold">{role.title}</h3>
                <span className="ml-auto text-[0.875rem] text-faint">
                  {role.when}
                </span>
              </div>

              <ul className="flex list-none flex-col gap-5 p-0">
                {role.bullets.map((bullet) => (
                  <li key={bullet} className="grid grid-cols-[10px_1fr] gap-4">
                    <span
                      aria-hidden="true"
                      className="mt-3 size-1.5 rounded-full bg-sage-ghost"
                    />
                    <Statement
                      text={bullet}
                      className="leading-[1.7] text-dim"
                    />
                  </li>
                ))}
              </ul>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}
