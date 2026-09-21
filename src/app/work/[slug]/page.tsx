import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, projects } from "@/content/projects";

export function generateStaticParams() { return projects.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> { const { slug } = await params; const project = getProject(slug); if (!project) return { title: "Not found" }; return { title: project.title, description: project.description, alternates: { canonical: `/work/${slug}` }, openGraph: { title: project.title, description: project.description, type: "article" } }; }

export default async function ProjectPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params; const project = getProject(slug); if (!project) notFound();
  return <article className="site-wrap"><header className="page-intro"><p className="eyebrow">Case study {project.year ? `· ${project.year}` : ""}</p><h1 className="mt-4 text-balance text-4xl sm:text-6xl">{project.title}</h1><p className="mt-5 max-w-2xl text-xl leading-relaxed">{project.summary}</p><p className="mt-4 max-w-2xl text-muted">{project.description}</p>{project.links && <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">{project.links.map((link) => <li key={link.href}><a href={link.href} target="_blank" rel="noreferrer noopener">{link.label} <span aria-hidden="true">↗</span></a></li>)}</ul>}</header><div className="case-study grid gap-x-16 lg:grid-cols-[minmax(0,1fr)_16rem]"><div>{project.sections.map((section) => <section key={section.title} className="border-t border-rule py-8"><h2>{section.title}</h2><div className="mt-4 max-w-[42rem] space-y-4 text-muted">{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></section>)}</div><aside className="order-first border-t border-rule py-6 lg:order-none lg:sticky lg:top-8 lg:self-start" aria-label="Technology stack"><h2 className="eyebrow">Stack</h2><ul className="mt-4 space-y-1 text-sm text-muted">{project.stack.map((item) => <li key={item}>{item}</li>)}</ul></aside></div><footer className="mt-12 border-t border-rule pt-7"><Link href="/work">← All work</Link><p className="mt-4">Need something built? <Link href="/contact">Get in touch <span aria-hidden="true">→</span></Link></p></footer></article>;
}
