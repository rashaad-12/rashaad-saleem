import { Fragment } from "react";

export function Statement({ text, className = "" }) {
  return (
    <p className={className}>
      {text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, i) => {
        if (part.startsWith("**")) {
          return (
            <b key={i} className="tnum font-medium text-ember">
              {part.slice(2, -2)}
            </b>
          );
        }
        if (part.startsWith("`")) {
          return (
            <code
              key={i}
              className="readout rounded-md bg-sage-ghost px-1.5 py-0.5 text-[0.8em] text-ink"
            >
              {part.slice(1, -1)}
            </code>
          );
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </p>
  );
}

export function Label({ children }) {
  return <p className="label">{children}</p>;
}

export function SectionHead({ eyebrow, title, note }) {
  return (
    <div className="mb-14">
      {eyebrow ? <Label>{eyebrow}</Label> : null}

      <h2 className="text-display mt-5 text-[clamp(2rem,3.8vw,2.7rem)]">
        {title}
      </h2>

      {note ? (
        <p className="measure mt-4 text-[0.9375rem] text-dim">{note}</p>
      ) : null}

      <div className="rule mt-8" />
    </div>
  );
}

export function Facts({ items, className = "" }) {
  return (
    <ul className={`flex list-none flex-wrap gap-2 p-0 ${className}`}>
      {items.map((item) => (
        <li key={item} className="pill">
          {item}
        </li>
      ))}
    </ul>
  );
}

export function Chip({ children }) {
  return <span className="pill text-[0.75rem]">{children}</span>;
}

export function LiveBadge({ label }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-pill bg-sage-ghost px-2.5 py-1 text-[0.75rem] font-medium text-sage">
      <span aria-hidden="true" className="size-[6px] rounded-full bg-sage" />
      {label}
    </span>
  );
}

export function ActionLink({
  href,
  children,
  external = false,
  primary = false,
}) {
  const target = external
    ? { target: "_blank", rel: "noreferrer noopener" }
    : {};

  return (
    <a
      href={href}
      {...target}
      className={[
        "group inline-flex items-center gap-2 text-[0.9375rem] transition-colors duration-200",
        primary ? "font-medium text-sage" : "text-dim hover:text-sage",
      ].join(" ")}
    >
      <span className="underline decoration-current/25 underline-offset-[5px] transition-colors group-hover:decoration-current/70">
        {children}
      </span>
      <span
        aria-hidden="true"
        className="transition-transform duration-200 group-hover:translate-x-0.5"
      >
        {external ? "↗" : "→"}
      </span>
    </a>
  );
}

export function MetaLink({ href, children, external = false }) {
  const target = external
    ? { target: "_blank", rel: "noreferrer noopener" }
    : {};

  return (
    <a
      href={href}
      {...target}
      className="text-[0.9375rem] text-dim underline decoration-current/25 underline-offset-[5px] transition-colors duration-200 hover:text-sage hover:decoration-current/70"
    >
      {children}
    </a>
  );
}
