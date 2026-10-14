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
    jobTitle: "software developer",
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
          software developer.
        </h1>
        <p className="mt-7 max-w-[43rem] text-pretty text-lg leading-relaxed sm:text-xl">
          {site.intro}
        </p>
        <div className="mt-9 flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/work">
            view my work <span aria-hidden="true">→</span>
          </Link>
          <Link href="/contact">
            let's build together <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
      <section aria-labelledby="selected-work">
        <SectionHeading id="selected-work">work</SectionHeading>
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
            all work <span aria-hidden="true">→</span>
          </Link>
        </p>
      </section>
      <section className="section-space max-w-[49rem]">
        <SectionHeading>tools i reach for</SectionHeading>
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
        <h2 className="mt-4 max-w-xl text-balance text-2xl sm:text-3xl">
          let's build together!!!
        </h2>
        <p className="mt-5">
          <Link href="/contact">
            let's talk <span aria-hidden="true">→</span>
          </Link>
        </p>
      </section>
    </div>
  );
}
