/**
 * Wireframe globe, same construction as dennissnellenberg.com: three meridian circles
 * squeeze to a line and back (so they sweep across like a turning sphere) while the
 * whole ball rocks left and right. Pure CSS, see `.globe` in globals.css.
 */
export function Globe({ className = "" }: { className?: string }) {
  return (
    <span className={`globe ${className}`} aria-hidden>
      <span className="globe-wrap">
        <span className="globe-circle" />
        <span className="globe-circle" />
        <span className="globe-circle" />
        <span className="globe-hor" />
        <span className="globe-hor-middle" />
      </span>
    </span>
  );
}
