import { profile } from "@/content/profile";
import { LogoMark } from "@/components/logo";

export function Splash() {
  return (
    <div className="splash" aria-hidden="true">
      <div className="splash-card">
        <LogoMark className="splash-mark" />
        <span className="splash-name text-display">{profile.name}</span>
        <span className="splash-rule" />
        <span className="splash-role">{profile.role}</span>
      </div>
    </div>
  );
}
