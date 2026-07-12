import { projects } from "@/content/projects";
import { ActionLink, Chip, LiveBadge, SectionHead } from "../ui";
import { Reveal } from "../motion";

export function Projects() {
  return (
    <section id="projects" className="scroll-mt-28 py-24">
      <SectionHead eyebrow="Selected work" title="Projects" />

      <div className="flex flex-col gap-7">
        {projects.map((project, i) => (
          <Reveal key={project.slug} index={i}>
            <article className="card card-hover p-7 sm:p-9">
              <div className="mb-2 flex flex-wrap items-center gap-x-4 gap-y-2">
                <h3 className="text-display text-[1.4rem]">{project.name}</h3>
                {project.badge ? <LiveBadge label={project.badge} /> : null}
                <span className="ml-auto text-[0.8125rem] text-faint">
                  {project.kind}
                </span>
              </div>

              <p className="mb-7 mt-4 leading-[1.7] text-dim">
                {project.description}
              </p>

              <div className="mb-7 flex flex-wrap gap-2">
                {project.stack.map((item) => (
                  <Chip key={item}>{item}</Chip>
                ))}
              </div>

              <div className="flex flex-wrap gap-x-7 gap-y-3">
                {project.liveUrl ? (
                  <ActionLink href={project.liveUrl} external primary>
                    {project.liveLabel}
                  </ActionLink>
                ) : null}
                {project.sourceUrl ? (
                  <ActionLink href={project.sourceUrl} external>
                    Source
                  </ActionLink>
                ) : null}
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
