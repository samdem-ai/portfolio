import { Fragment, type ElementType } from "react";

/** Server-rendered text split into word masks for the [data-reveal] slide-up. */
export function Words({ text, as: Tag = "span", className, delay }: { text: string; as?: ElementType; className?: string; delay?: number }) {
  const words = text.split(/\s+/).filter(Boolean);
  return (
    <Tag className={className} data-reveal={delay ?? ""}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map((w, i) => (
          <Fragment key={i}>
            <span className="rw">
              <span>{w}</span>
            </span>{" "}
          </Fragment>
        ))}
      </span>
    </Tag>
  );
}
