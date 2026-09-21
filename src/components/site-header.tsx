import Link from "next/link";
import { nav, site } from "@/content/site";

export function SiteHeader() {
  return (
    <header className="site-wrap pt-7 pb-8 sm:pt-10 sm:pb-12">
      <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 border-b border-rule pb-5">
        <Link href="/" className="quiet-link font-semibold tracking-[-0.012em]">
          {site.name} <span className="font-normal text-muted">/ {site.handle}</span>
        </Link>
        <nav aria-label="Primary">
          <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm sm:gap-x-5">
            {nav.map((item) => <li key={item.href}><Link href={item.href} className="quiet-link text-muted">{item.label}</Link></li>)}
          </ul>
        </nav>
      </div>
    </header>
  );
}
