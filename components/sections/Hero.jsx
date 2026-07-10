import Image from "next/image";
import { profile } from "@/content/profile";
import { Facts, Label } from "../ui";
import { HeroHeading, FadeIn } from "../motion";

export function Hero() {
  return (
    <section id="top" className="scroll-mt-28 pb-24 pt-20 sm:pt-28">
      <Label>{profile.role}</Label>

      <div className="mt-7">
        <HeroHeading lines={profile.headline} accent={profile.headlineAccent} />
      </div>

      <FadeIn delay={0.4}>
        <p className="measure mt-9 text-[1.1875rem] leading-[1.65] text-dim">
          {profile.lede}
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <a className="btn" href="#experience">
            See the work
          </a>
          <a className="btn btn-ghost" href={`mailto:${profile.email}`}>
            Get in touch
          </a>
        </div>

        <Facts items={profile.status} className="mt-12" />
      </FadeIn>

      <FadeIn delay={0.62}>
        <div className="card mt-16 grid overflow-hidden sm:grid-cols-[240px_1fr]">
          <figure className="relative isolate m-0 min-h-75 bg-plate sm:min-h-full">
            <Image
              src={profile.portrait.src}
              alt={profile.portrait.alt}
              fill
              priority
              sizes="(min-width: 640px) 240px, 100vw"
              className="object-cover object-[center_16%] mix-blend-screen sepia-[0.14] saturate-[1.05]"
            />

            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-plate to-transparent"
            />

            <figcaption className="absolute inset-x-0 bottom-0 px-5 pb-5">
              <span className="block text-[0.9375rem] font-medium leading-tight text-plate-ink">
                {profile.name}
              </span>
              <span className="mt-1 block text-[0.8125rem] leading-tight text-plate-ink/55">
                {profile.portrait.caption}
              </span>
            </figcaption>
          </figure>

          <div className="flex flex-col gap-6 p-7 text-dim sm:p-9">
            {profile.about.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
