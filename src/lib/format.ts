/** Fixed to UTC so server and client always agree on the rendered string. */
function format(iso: string, options: Intl.DateTimeFormatOptions): string {
  const date = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("en-GB", { ...options, timeZone: "UTC" }).format(date);
}

export function formatDate(iso: string): string {
  return format(iso, { day: "numeric", month: "long", year: "numeric" });
}

export function formatDateShort(iso: string): string {
  return format(iso, { month: "short", year: "numeric" });
}
