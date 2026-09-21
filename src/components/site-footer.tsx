import { site, socials } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="site-wrap pt-20 pb-10 sm:pt-28 sm:pb-12">
      <div className="grid gap-6 border-t border-rule pt-6 text-sm sm:grid-cols-[1fr_auto] sm:items-end">
        <div><p className="font-medium">{site.name}</p><p className="text-muted">{site.location}</p></div>
        <div className="sm:text-right">
          <ul className="flex flex-wrap gap-x-4 sm:justify-end">
            {Object.entries(socials).map(([label, href]) => <li key={label}><a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer noopener" : undefined}>{label}</a></li>)}
          </ul>
        </div>
      </div>
    </footer>
  );
}
