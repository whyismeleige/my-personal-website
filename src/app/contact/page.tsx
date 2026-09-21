import type { Metadata } from "next";
import { site, socials } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Work with ${site.name} on a product, AI system or automation.`,
  alternates: { canonical: "/contact" },
};
export default function ContactPage() {
  return (
    <div className="site-wrap">
      <article className="page-intro max-w-[45rem]">
        <p className="eyebrow">Contact</p>
        <h1 className="mt-4 text-balance text-4xl sm:text-6xl">
          Let’s build something.
        </h1>
        <p className="mt-7 text-lg leading-relaxed">
          Have a product you want to build, a workflow that should be automated,
          or an existing system that needs help?
        </p>
        <p className="mt-4 text-lg leading-relaxed text-muted">
          Send me a message with what you’re working on and what you need. A
          rough outline is plenty.
        </p>
        <div className="mt-10 border-t border-rule">
          <a className="contact-row quiet-link" href={socials.Email}>
            <span>
              <span className="block text-sm text-muted">Email</span>
              {site.email}
            </span>
            <span aria-hidden="true">→</span>
          </a>
          <a
            className="contact-row quiet-link"
            href={socials.GitHub}
            target="_blank"
            rel="noreferrer noopener"
          >
            <span>
              <span className="block text-sm text-muted">Elsewhere</span>GitHub
            </span>
            <span aria-hidden="true">↗</span>
          </a>
          <a
            className="contact-row quiet-link"
            href={socials.LinkedIn}
            target="_blank"
            rel="noreferrer noopener"
          >
            <span>
              <span className="block text-sm text-muted">Elsewhere</span>LinkedIn
            </span>
            <span aria-hidden="true">↗</span>
          </a>
        </div>
        <p className="mt-8 text-sm text-muted">
          <span className="availability-dot" aria-hidden="true" />
          {site.availability}
        </p>
      </article>
    </div>
  );
}
