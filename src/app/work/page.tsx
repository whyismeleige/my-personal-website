import type { Metadata } from "next";
import Link from "next/link";
import { ProjectPreview } from "@/components/project-preview";
import { projects } from "@/content/projects";

export const metadata: Metadata = { title: "Work", description: "Products, systems and experiments built by Piyush Jain.", alternates: { canonical: "/work" } };

export default function WorkPage() {
  return <div className="site-wrap"><header className="page-intro"><p className="eyebrow">Work</p><h1 className="mt-4 max-w-2xl text-balance text-3xl sm:text-5xl">Software built around real problems.</h1><p className="mt-5 max-w-2xl text-lg text-muted">Full-stack products, AI systems and tools I’ve taken from a rough idea to working software.</p></header><div>{projects.map((project, index) => <ProjectPreview key={project.slug} project={project} index={index} />)}</div><aside className="mt-16 border-t border-rule pt-7"><p>Have something similar in mind? <Link href="/contact">Let’s talk <span aria-hidden="true">→</span></Link></p></aside></div>;
}
