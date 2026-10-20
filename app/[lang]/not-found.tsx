import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[100svh] flex-col justify-center bg-dark text-on-dark">
      <div className="wrap">
        <p className="big text-[clamp(7rem,26vw,22rem)] leading-[0.85]">404</p>
        <p className="mt-10 max-w-[48ch] text-lg">This address points to nothing. Either the page moved, or you&apos;re fuzzing me. Both are fine.</p>
        <p className="mt-2 max-w-[48ch] text-on-dark-muted" lang="fr">
          Cette adresse ne pointe vers rien. Soit la page a bougé, soit vous êtes en train de me fuzzer.
        </p>
        <Link href="/" className="pill mt-10 border-dark-rule">
          ← Home
        </Link>
      </div>
    </section>
  );
}
