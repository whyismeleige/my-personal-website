import type { Metadata } from "next";
import { site, socials } from "@/content/site";

export const metadata: Metadata = {
  title: "contact",
  description: `work with ${site.name} on a product, ai system or automation.`,
  alternates: { canonical: "/contact" },
};
export default function ContactPage() {
  return (
    <div className="site-wrap">
      <article className="page-intro max-w-[45rem]">
        <p className="eyebrow">contact</p>
        <h1 className="mt-4 text-balance text-4xl sm:text-6xl">
          let's build together.
        </h1>
        <p className="mt-7 text-lg leading-relaxed">
          let's talk. if our vibes match, let's build together.
        </p>
        <p className="mt-4 text-lg leading-relaxed text-muted">hit me up.</p>
        <div className="mt-10 border-t border-rule">
          <a className="contact-row quiet-link" href={socials.email}>
            <span>
              <span className="block text-sm text-muted">email</span>
              {site.email}
            </span>
            <span aria-hidden="true">→</span>
          </a>
          <a
            className="contact-row quiet-link"
            href={socials.github}
            target="_blank"
            rel="noreferrer noopener"
          >
            <span>
              <span className="block text-sm text-muted">elsewhere</span>github
            </span>
            <span aria-hidden="true">↗</span>
          </a>
          <a
            className="contact-row quiet-link"
            href={socials.linkedin}
            target="_blank"
            rel="noreferrer noopener"
          >
            <span>
              <span className="block text-sm text-muted">elsewhere</span>
              linkedin
            </span>
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </article>
    </div>
  );
}
