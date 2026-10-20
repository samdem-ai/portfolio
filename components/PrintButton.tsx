"use client";

export function PrintButton({ label }: { label: string }) {
  return (
    <button type="button" onClick={() => window.print()} className="pill border-transparent bg-on-dark text-dark">
      {label}
    </button>
  );
}
