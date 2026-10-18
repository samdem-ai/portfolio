import type { ReactNode } from "react";
import { Words } from "@/components/motion/Words";

/** Dark top band used by every inner page: big title, optional content underneath. */
export function PageHero({ title, eyebrow, children, size = "lg" }: { title: string; eyebrow?: string; children?: ReactNode; size?: "lg" | "xl" }) {
  return (
    <section className="bg-dark pb-20 pt-40 text-on-dark sm:pb-28 sm:pt-52">
      <div className="wrap">
        {eyebrow && (
          <p data-fade className="eyebrow mb-6 text-on-dark-muted">
            {eyebrow}
          </p>
        )}
        <Words
          as="h1"
          text={title}
          className={`big block max-w-[16ch] ${size === "xl" ? "text-[clamp(3rem,9vw,8.5rem)]" : "text-[clamp(2.6rem,6.5vw,6rem)]"}`}
        />
        {children}
      </div>
    </section>
  );
}
