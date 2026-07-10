import { craft } from "@/content/craft";
import { Reveal } from "../motion";

const ICONS = {
  services: (
    <>
      <rect x="3" y="4" width="18" height="6" rx="3" />
      <rect x="3" y="14" width="18" height="6" rx="3" />
      <path d="M7 7h.01M7 17h.01" />
    </>
  ),
  interface: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="4" />
      <path d="M3 9h18M8 14h6" />
    </>
  ),
  refactor: (
    <>
      <path d="M4 7h5c4 0 3 10 7 10h4" />
      <path d="M4 17h5" />
      <path d="M17 14l3 3-3 3" />
    </>
  ),
  operate: (
    <>
      <path d="M2 12h4l2.5-6 4 12L15 12h7" />
    </>
  ),
};

export function Craft() {
  return (
    <section className="pb-24">
      <div className="grid gap-5 sm:grid-cols-2">
        {craft.map((item, i) => (
          <Reveal key={item.title} index={i}>
            <div className="card card-hover h-full p-7">
              <span
                aria-hidden="true"
                className="mb-6 grid size-11 place-items-center rounded-soft bg-sage-ghost text-sage"
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {ICONS[item.icon]}
                </svg>
              </span>

              <h3 className="text-display mb-3 text-[1.25rem]">{item.title}</h3>
              <p className="text-[0.9375rem] leading-[1.7] text-dim">
                {item.body}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
