import type { Metadata } from "next";
import Link from "next/link";
import { getEssays } from "@/lib/essays";
import { formatDateShort } from "@/lib/format";

export const metadata: Metadata = {
  title: "Essays",
  description: "Long-form writing — on craft, attention, and whatever else refuses to stay quiet.",
};

export default function EssaysPage() {
  const essays = getEssays();

  return (
    <div className="wrap">
      <h1>Essays</h1>

      {essays.length === 0 ? (
        <p className="mt-4 text-muted">On vacation, probably ;)</p>
      ) : (
        <ul className="mt-6 space-y-2.5">
          {essays.map((essay) => (
            <li
              key={essay.slug}
              className="grid gap-x-4 sm:grid-cols-[5.5rem_1fr] sm:items-baseline"
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
