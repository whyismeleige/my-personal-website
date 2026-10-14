import type { Project } from "@/content/projects";

export function ProjectPreview({ project, index }: { project: Project; index?: number }) {
  return (
    <article className="project-preview grid gap-3 border-t border-rule py-7 sm:grid-cols-[6rem_1fr] sm:gap-6">
      <p className="text-sm text-muted tabular-nums" aria-hidden="true">
        {String((index ?? 0) + 1).padStart(2, "0")}
      </p>
      <div>
        <h3 className="text-[1.2rem]">{project.title}</h3>
        <p className="mt-1 font-medium">{project.subtitle}</p>
        <p className="mt-2 max-w-[42rem] text-muted">{project.description}</p>
        <p className="mt-3 text-sm text-muted">{project.tags.join(" · ")}</p>
        {project.links && project.links.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            {project.links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  {link.label} <span aria-hidden="true">↗</span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
