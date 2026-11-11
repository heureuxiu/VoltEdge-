import { LogoMark } from "@/components/admin/LogoMark";

/** Shown while the persisted admin state is restored. */
export function SplashScreen() {
  return (
    <div className="grid min-h-dvh place-items-center bg-bg">
      <span className="grid size-16 animate-pulse place-items-center rounded-3xl bg-accent text-accent-ink">
        <LogoMark className="h-8" />
      </span>
    </div>
  );
}
