import { profile } from "@/content/profile";
import { Facts, Label } from "../ui";
import { Reveal } from "../motion";

export function Education() {
  const { degree, school, university, when, note } = profile.education;

  return (
    <Reveal className="pb-24">
      <div className="card p-8 sm:p-10">
        <div className="grid items-start gap-8 sm:grid-cols-[1fr_auto]">
          <div>
            <Label>Before this</Label>

            <h3 className="text-display mt-5 text-[1.5rem]">{degree}</h3>

            <p className="mt-2 text-[0.9375rem] text-dim">
              {school}, {university}
            </p>

            <p className="measure mt-6 leading-[1.7] text-dim">{note}</p>
          </div>

          <span className="text-display tnum text-[1.6rem] text-ember sm:text-right">
            {when}
          </span>
        </div>

        <div className="mt-10 grid gap-8 border-t border-line-soft pt-8 sm:grid-cols-2">
          <div>
            <p className="mb-4 text-[0.875rem] font-medium">Certifications</p>
            <ul className="flex list-none flex-col gap-4 p-0">
              {profile.certifications.map((cert) => (
                <li key={cert.name}>
                  <a
                    href={cert.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="group inline-flex items-start gap-1.5 text-[0.875rem] leading-snug text-dim transition-colors duration-200 hover:text-sage"
                  >
                    <span className="underline decoration-current/20 underline-offset-4 transition-colors group-hover:decoration-current/60">
                      {cert.name}
                    </span>
                    <span aria-hidden="true" className="shrink-0">
                      ↗
                    </span>
                  </a>
                  <span className="mt-1 block text-[0.8125rem] text-faint">
                    {cert.issuer}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 text-[0.875rem] font-medium">Languages</p>
            <Facts items={profile.languages} />
          </div>
        </div>
      </div>
    </Reveal>
  );
}
