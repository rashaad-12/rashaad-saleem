import logo from "@/lib/logo.json";

export function LogoMark({ className, title }) {
  return (
    <svg
      viewBox={logo.viewBox}
      className={className}
      fill="currentColor"
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : "true"}
      focusable="false"
    >
      <path fillRule={logo.fillRule} d={logo.path} />
    </svg>
  );
}
