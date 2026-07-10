"use client";

import { useEffect, useState } from "react";
import { profile } from "@/content/profile";
import { SECTIONS } from "@/content/sections";
import { ThemeToggle } from "./ThemeToggle";

const LIFT_AT = 24;

export function Header() {
  const [lifted, setLifted] = useState(false);

  useEffect(() => {
    let raf = 0;

    const read = () => setLifted(window.scrollY > LIFT_AT);

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(read);
    };

    read();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header className="pointer-events-none sticky top-0 z-40">
      <div className="mx-auto flex h-20 max-w-300 items-center px-4 sm:px-6">
        <div
          className={`pointer-events-auto flex w-full items-center gap-6 border transition-all duration-500 ease-soft ${
            lifted
              ? "mx-auto max-w-220 rounded-pill border-line-soft bg-lift/60 bg-(image:--sheen) px-5 py-2.5 shadow-[var(--edge),var(--shadow-soft)] backdrop-blur-xl backdrop-saturate-150"
              : "max-w-300 rounded-none border-transparent bg-transparent px-2 py-3.5"
          }`}
        >
          <a
            href="/"
            className="mr-auto flex items-center gap-2.5 text-[0.9375rem] font-medium tracking-[0.005em]"
          >
            <span aria-hidden="true" className="size-2 rounded-full bg-sage" />
            {profile.name}
          </a>

          <nav
            aria-label="Sections"
            className="hidden gap-6 lg:flex min-[1340px]:hidden"
          >
            {SECTIONS.map(({ id, label }) => (
              <a
                key={id}
                href={`/#${id}`}
                className="text-[0.875rem] text-dim transition-colors duration-200 hover:text-ink"
              >
                {label}
              </a>
            ))}
          </nav>

          <ThemeToggle />

          <a className="btn btn-small" href={profile.resumePdf} download>
            Résumé
            <span aria-hidden="true">↓</span>
          </a>
        </div>
      </div>
    </header>
  );
}
