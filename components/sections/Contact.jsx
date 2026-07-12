import { profile } from "@/content/profile";
import { Label } from "../ui";

const ICONS = {
  linkedin: <path d="M5 8v9M5 4.5v.01M10 17v-5a2.5 2.5 0 0 1 5 0v5" />,
  github: (
    <path d="M9 18c-4 1.2-4-2.4-5.5-3M15 21v-3.4a2.9 2.9 0 0 0-.8-2.3c2.7-.3 5.5-1.3 5.5-6a4.7 4.7 0 0 0-1.3-3.2 4.3 4.3 0 0 0-.1-3.2s-1-.3-3.4 1.3a11.6 11.6 0 0 0-6 0C6.5 2.6 5.4 2.9 5.4 2.9a4.3 4.3 0 0 0-.1 3.2A4.7 4.7 0 0 0 4 9.3c0 4.7 2.8 5.7 5.5 6a2.9 2.9 0 0 0-.8 2.3V21" />
  ),
  phone: (
    <path d="M6 3h3l1.5 4-2 1.5a11 11 0 0 0 5 5L15 11.5 19 13v3a2 2 0 0 1-2.2 2A16 16 0 0 1 4 5.2 2 2 0 0 1 6 3Z" />
  ),
  resume: (
    <path d="M12 3v11m0 0-3.5-3.5M12 14l3.5-3.5M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
  ),
};

const LINKS = [
  {
    icon: "linkedin",
    label: "LinkedIn",
    value: "in/rashaad-saleem",
    href: profile.linkedin,
    external: true,
  },
  {
    icon: "github",
    label: "GitHub",
    value: "rashaad-12",
    href: profile.github,
    external: true,
  },
  {
    icon: "phone",
    label: "Phone",
    value: profile.phone,
    href: profile.phoneHref,
    external: false,
  },
  {
    icon: "resume",
    label: "Resume",
    value: "PDF, one page",
    href: profile.resumePdf,
    external: false,
    download: true,
  },
];

export function Contact() {
  return (
    <section id="contact" className="scroll-mt-28 pb-24">
      <div className="card p-8 sm:p-12">
        <Label>Open to work</Label>

        <h2 className="text-display mb-7 mt-6 max-w-[20ch] text-[clamp(1.9rem,4vw,2.8rem)]">
          Looking for an engineer who takes a problem end to end?
        </h2>

        <p className="measure leading-[1.7] text-dim">
          I am open to Software Engineer roles. Based in Bangalore, ready to
          relocate and available for remote, hybrid or onsite work. Email is the
          fastest way to reach me.
        </p>

        <a
          href={`mailto:${profile.email}`}
          className="text-display wrap-break-word mt-10 inline-block text-[clamp(1.3rem,2.6vw,2rem)] text-sage underline decoration-current/25 underline-offset-8 transition-colors duration-200 hover:decoration-current/70"
        >
          {profile.email}
        </a>

        <div className="mt-11 grid gap-3 sm:grid-cols-2">
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              download={link.download}
              {...(link.external
                ? { target: "_blank", rel: "noreferrer noopener" }
                : {})}
              className="group flex items-center gap-4 rounded-soft px-4 py-3.5 transition-colors duration-200 hover:bg-sunk"
            >
              <span
                aria-hidden="true"
                className="grid size-9 shrink-0 place-items-center rounded-soft bg-sage-ghost text-sage"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {ICONS[link.icon]}
                </svg>
              </span>

              <span className="min-w-0">
                <span className="block text-[0.9375rem] font-medium leading-tight">
                  {link.label}
                </span>
                <span className="mt-0.5 block truncate text-[0.8125rem] leading-tight text-faint">
                  {link.value}
                </span>
              </span>

              <span
                aria-hidden="true"
                className="ml-auto shrink-0 text-faint transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-sage"
              >
                {link.external ? "↗" : "→"}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
