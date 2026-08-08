import { site, socials } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="wrap pt-16 pb-14">
      <hr className="mb-6 border-0 border-t border-rule" />

      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 text-sm text-muted">
        <p>
          © {new Date().getFullYear()} {site.name}
        </p>

        <ul className="flex flex-wrap gap-x-4">
          {Object.entries(socials).map(([social, href]) => {
            const external = href.startsWith("http");
            return (
              <li key={social}>
                <a
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noreferrer noopener" : undefined}
                >
                  {social}
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </footer>
  );
}
