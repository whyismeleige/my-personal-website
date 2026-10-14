import type { Metadata } from "next";
import { site, socials } from "@/content/site";

export const metadata: Metadata = {
  title: "about",
  description: `about ${site.name}, an independent software developer in ${site.location}.`,
  alternates: { canonical: "/about" },
};
export default function AboutPage() {
  return (
    <div className="site-wrap">
      <article className="editorial-page">
        <p className="eyebrow">about</p>
        <h1 className="mt-4 text-balance text-3xl sm:text-5xl">
          i like building stuff.
        </h1>
        <div className="mt-9 space-y-5 text-lg leading-relaxed">
          <p>i'm piyush, a software developer from hyderabad, india.</p>
          <p>
            i like building things, that can genuinely solve problems for
            others.
          </p>
          <p>
            most of my work sits somewhere between full-stack development, ai
            and automation. i've built web applications, ai automations, ai
            agents, etc.
          </p>
          <p>
            i've also won multiple hackathons and have actively participated in
            various club activities in my college.
          </p>
          <p>
            outside software, i'm interested in mountaineering, filmmaking,
            anime and manga.
            <br /> i also dump my thoughts on{" "}
            <a
              href="https://substack.com/@pyushjain"
              target="_blank"
              rel="noreferrer noopener"
            >
              substack
            </a>
            .
          </p>
        </div>
        <ul className="mt-10 flex flex-wrap gap-x-5 gap-y-2">
          {Object.entries(socials).map(([label, href]) => (
            <li key={label}>
              <a
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={
                  href.startsWith("http") ? "noreferrer noopener" : undefined
                }
              >
                {label}
                {href.startsWith("http") && <span aria-hidden="true"> ↗</span>}
              </a>
            </li>
          ))}
        </ul>
      </article>
    </div>
  );
}
