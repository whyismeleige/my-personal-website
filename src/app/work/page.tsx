import type { Metadata } from "next";
import { projects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Work",
  description: "Things I've built, in various states of repair.",
};

function isExternal(href: string) {
  return href.startsWith("http");
}

export default function WorkPage() {
  return (
    <div className="wrap">
      <h1>Work</h1>

      {projects.length === 0 && <p className="mt-4 text-muted">Currently unemployed ;)</p>}

      <div className="mt-8 space-y-9">
        {projects.map((project) => (
          <article key={project.title}>
            <h2>
              {project.title}{" "}
              <span className="font-normal text-muted tabular-nums">{project.year}</span>
            </h2>

            <p className="mt-1.5">{project.body}</p>

            <p className="mt-1.5 text-sm text-muted">{project.stack.join(", ")}</p>

            {project.links && project.links.length > 0 && (
              <ul className="mt-1.5 flex flex-wrap gap-x-4 text-sm">
                {project.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={isExternal(link.href) ? "_blank" : undefined}
                      rel={isExternal(link.href) ? "noreferrer noopener" : undefined}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
