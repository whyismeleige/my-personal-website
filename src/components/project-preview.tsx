import Link from "next/link";
import type { Project } from "@/content/projects";

export function ProjectPreview({ project, index }: { project: Project; index?: number }) {
  return (
    <article className="project-preview grid gap-3 border-t border-rule py-7 sm:grid-cols-[6rem_1fr] sm:gap-6">
      <p className="text-sm text-muted tabular-nums" aria-hidden="true">
        {index === undefined ? project.year : String(index + 1).padStart(2, "0")}
      </p>
      <div>
        <h3 className="text-[1.2rem]">
          <Link href={`/work/${project.slug}`} className="quiet-link project-link">
            {project.title} <span aria-hidden="true">↗</span>
          </Link>
        </h3>
        <p className="mt-1 font-medium">{project.summary}</p>
        <p className="mt-2 max-w-[42rem] text-muted">{project.description}</p>
        <p className="mt-3 text-sm text-muted">{project.stack.join(" · ")}</p>
      </div>
    </article>
  );
}
