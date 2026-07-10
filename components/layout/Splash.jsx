import { profile } from "@/content/profile";

export function Splash() {
  return (
    <div className="splash" aria-hidden="true">
      <div className="splash-card">
        <span className="splash-name text-display">{profile.name}</span>
        <span className="splash-rule" />
        <span className="splash-role">{profile.role}</span>
        <p className="splash-tagline">
          Turning caffeine into scalable systems.
        </p>
      </div>
    </div>
  );
}
