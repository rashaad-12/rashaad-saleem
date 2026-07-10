import { incident } from "@/content/incident";
import { Label } from "../ui";
import { Reveal } from "../motion";

export function IncidentCallout() {
  return (
    <Reveal className="pb-24">
      <a
        href="/incident"
        className="card card-hover group block p-8 sm:p-10"
        aria-label={`Read the full story: ${incident.title}`}
      >
        <Label>{incident.eyebrow}</Label>

        <h2 className="text-display mt-5 text-[clamp(1.8rem,3.6vw,2.5rem)]">
          {incident.title}
        </h2>

        <p className="mt-6 leading-[1.7] text-dim">{incident.teaser}</p>

        <span className="mt-8 inline-flex items-center gap-2 font-medium text-sage">
          <span className="underline decoration-current/25 underline-offset-[5px] transition-colors group-hover:decoration-current/70">
            Read the full story
          </span>
          <span
            aria-hidden="true"
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          >
            →
          </span>
        </span>
      </a>
    </Reveal>
  );
}
