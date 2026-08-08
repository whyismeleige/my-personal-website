import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getEssay, getEssays, getNeighbours } from "@/lib/essays";
import { formatDate } from "@/lib/format";
import { site } from "@/content/site";

export function generateStaticParams() {
  return getEssays().map((essay) => ({ slug: essay.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/essays/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const essay = await getEssay(slug);
  if (!essay) return { title: "Not found" };

  return {
    title: essay.title,
    description: essay.subtitle ?? essay.excerpt,
    openGraph: {
      type: "article",
      title: essay.title,
      description: essay.subtitle ?? essay.excerpt,
      publishedTime: essay.date,
      authors: [site.name],
    },
  };
}

export default async function EssayPage({ params }: PageProps<"/essays/[slug]">) {
  const { slug } = await params;
  const essay = await getEssay(slug);
  if (!essay) notFound();

  const { previous, next } = getNeighbours(slug);

  return (
    <div className="wrap">
      <article>
        <h1 className="text-balance">{essay.title}</h1>

        {essay.subtitle && <p className="mt-2 text-muted">{essay.subtitle}</p>}

        <p className="mt-2 text-sm text-muted">
          {formatDate(essay.date)} · {essay.readingTime} min read
        </p>

        <div className="prose mt-8" dangerouslySetInnerHTML={{ __html: essay.html }} />
      </article>

      {(previous || next) && (
        <nav aria-label="More essays" className="mt-14 border-t border-rule pt-5 text-sm">
          <ul className="space-y-1.5">
            {previous && (
              <li>
                <span className="text-muted">Previous: </span>
                <Link href={`/essays/${previous.slug}`}>{previous.title}</Link>
              </li>
            )}
            {next && (
              <li>
                <span className="text-muted">Next: </span>
                <Link href={`/essays/${next.slug}`}>{next.title}</Link>
              </li>
            )}
          </ul>
        </nav>
      )}
    </div>
  );
}
