import Link from "next/link";
import { ProjectPreview } from "@/components/project-preview";
import { SectionHeading } from "@/components/section-heading";
import { featuredProjects } from "@/content/projects";
import { capabilities, site, tools } from "@/content/site";

export default function HomePage() {
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    url: site.url,
    jobTitle: "Independent software developer",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Hyderabad",
      addressCountry: "IN",
    },
  };
  return (
    <div className="site-wrap">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <section className="max-w-[49rem] pt-6 pb-24 sm:pt-12 sm:pb-32">
        <p className="eyebrow">{site.name}</p>
        <h1 className="mt-5 text-balance text-[2.25rem] leading-[1.08] tracking-[-0.035em] sm:text-[3.8rem]">
          Independent software developer.
        </h1>
        <p className="mt-7 max-w-[43rem] text-pretty text-lg leading-relaxed sm:text-xl">
          {site.intro}
        </p>
        <p className="mt-6 text-sm text-muted">
          <span className="availability-dot" aria-hidden="true" />
          {site.availability}
        </p>
        <div className="mt-9 flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/work">
            View my work <span aria-hidden="true">→</span>
          </Link>
          <Link href="/contact">
            Let’s work together <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
      <section aria-labelledby="selected-work">
        <SectionHeading id="selected-work">Work</SectionHeading>
        <div className="mt-5">
          {featuredProjects.map((project, index) => (
            <ProjectPreview
              key={project.slug}
              project={project}
              index={index}
            />
          ))}
        </div>
        <p className="mt-5">
          <Link href="/work">
            All work <span aria-hidden="true">→</span>
          </Link>
        </p>
      </section>
      <section className="section-space" aria-labelledby="capabilities">
        <SectionHeading id="capabilities">What I can help with</SectionHeading>
        <ol className="mt-5 grid border-t border-rule sm:grid-cols-2">
          {capabilities.map((item, index) => (
            <li
              key={item.title}
              className="grid grid-cols-[2.5rem_1fr] gap-3 border-b border-rule py-5 sm:odd:pr-7 sm:even:border-l sm:even:pl-7"
            >
              <span className="text-sm text-muted tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3>{item.title}</h3>
                <p className="mt-1 text-sm text-muted">{item.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
      <section className="section-space max-w-[49rem]">
        <SectionHeading>Tools I reach for</SectionHeading>
          <dl className="mt-5 border-t border-rule">
            {tools.map((tool) => (
              <div
                key={tool.group}
                className="grid gap-1 border-b border-rule py-4 sm:grid-cols-[7.5rem_1fr]"
              >
                <dt className="font-medium">{tool.group}</dt>
                <dd className="text-muted">{tool.items}</dd>
              </div>
            ))}
          </dl>
      </section>
      <section className="section-space border-t border-rule pt-8">
        <p className="eyebrow">Have something in mind?</p>
        <h2 className="mt-4 max-w-xl text-balance text-2xl sm:text-3xl">
          Need a product built, a workflow automated, or an odd idea made real?
        </h2>
        <p className="mt-5">
          <Link href="/contact">
            Let’s talk <span aria-hidden="true">→</span>
          </Link>
        </p>
      </section>
    </div>
  );
}
