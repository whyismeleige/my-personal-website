import type { Metadata } from "next";
import Link from "next/link";
import { ProjectPreview } from "@/components/project-preview";
import { projects } from "@/content/projects";

export const metadata: Metadata = {
  title: "work",
  description: "products, systems and experiments built by piyush jain.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  return (
    <div className="site-wrap">
      <header className="page-intro">
        <p className="eyebrow">work</p>
        <h1 className="mt-4 max-w-2xl text-balance text-3xl sm:text-5xl">
          i enjoy solving problems through software.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-muted">
          full-stack products, ai systems and tools i've taken from a rough idea
          to working software.
        </p>
      </header>
      <div>
        {projects.map((project, index) => (
          <ProjectPreview key={project.slug} project={project} index={index} />
        ))}
      </div>
      <aside className="mt-16 border-t border-rule pt-7">
        <p>
          wanna build together?{" "}
          <Link href="/contact">
            let's talk <span aria-hidden="true">→</span>
          </Link>
        </p>
      </aside>
    </div>
  );
}
