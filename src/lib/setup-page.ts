import { NextResponse } from "next/server";

/** `body` is trusted markup by design; `title` is escaped in case it ever isn't. */
function escapeHtml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );
}

export function page({
  title,
  body,
  status = 200,
}: {
  title: string;
  body: string;
  status?: number;
}): NextResponse {
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>${escapeHtml(title)}</title>
<style>
  :root { color-scheme: light dark; }
  body { margin:0; min-height:100vh; display:grid; place-items:center; padding:2rem;
         background:#f5f3ef; color:#0c0c0c; font:16px/1.6 ui-serif, Georgia, serif; }
  main { max-width:44rem; border:2px solid currentColor; padding:2rem 2.25rem; }
  h1 { font-size:clamp(1.75rem,5vw,2.5rem); line-height:1.05; margin:0 0 1.25rem; }
  p { margin:0 0 1rem; }
  a { color:inherit; }
  code, pre { font-family:ui-monospace, monospace; font-size:.85em; }
  code { border:1px solid currentColor; padding:.1em .35em; }
  pre { border:2px solid currentColor; padding:1rem; white-space:pre-wrap; word-break:break-all; }
  .muted { opacity:.7; font-size:.9rem; }
  .ok { font-weight:700; }
  @media (prefers-color-scheme: dark) { body { background:#0a0a0a; color:#f1efe9; } }
</style></head>
<body><main><h1>${escapeHtml(title)}</h1>${body}</main></body></html>`;

  return new NextResponse(html, {
    status,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}
