import type { Metadata } from "next";
import Link from "next/link";
import { getEssays } from "@/lib/essays";
import { formatDateShort } from "@/lib/format";

export const metadata: Metadata = {
  title: "Writing",
  description: "Long-form writing — on craft, attention, and whatever else refuses to stay quiet.",
  alternates: { canonical: "/essays" },
};

export default function EssaysPage() {
  const essays = getEssays();

  return (
    <div className="prose-wrap">
      <header className="pb-8">
        <p className="eyebrow">Writing</p>
        <h1 className="mt-3">Essays, notes and things I wanted to think through.</h1>
      </header>

      {essays.length === 0 ? (
        <p className="mt-4 text-muted">On vacation, probably ;)</p>
      ) : (
        <ul className="border-t border-rule">
          {essays.map((essay) => (
            <li
              key={essay.slug}
              className="grid border-b border-rule py-4 gap-x-4 sm:grid-cols-[6rem_1fr] sm:items-baseline"
            >
              <span className="text-sm text-muted tabular-nums">
                {formatDateShort(essay.date)}
              </span>
              <Link href={`/essays/${essay.slug}`} className="quiet-link">
                {essay.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
