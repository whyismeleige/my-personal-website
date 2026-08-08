import Link from "next/link";
import { nav, site } from "@/content/site";

/**
 * Name, three links, a hairline. Not sticky, no drawer, no toggle — at this
 * width the whole nav fits on one line on every phone, so there is nothing to
 * collapse.
 *
 * A server component, deliberately. Marking the current page would need
 * `usePathname`, which would make this the only client component in the app
 * and put a hydration boundary in the root layout for one CSS class. Every
 * page already names itself in its own h1, so the indicator was telling the
 * reader something the page had just said.
 *
 * The name is not a link. There is no home page to send it to — `/` redirects
 * to `/essays`, which the nav already lists — so linking it would be either a
 * wasted hop or a duplicate of the first nav item.
 */
export function SiteHeader() {
  return (
    <header className="wrap pt-10 pb-8 sm:pt-14">
      <p className="text-base font-semibold">{site.name}</p>

      <nav aria-label="Primary" className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
        {nav.map((item) => (
          <Link key={item.href} href={item.href} className="quiet-link text-muted">
            {item.short}
          </Link>
        ))}
      </nav>

      <hr className="mt-8 border-0 border-t border-rule" />
    </header>
  );
}
