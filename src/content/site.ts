export const site = {
  name: "Piyush Jain",
  description: "Piyush Jain's website.",
  email: "personal.piyushjain@gmail.com",
  url: "https://piyushbuilds.me",
  locale: "en_IN",
} as const;

export const socials = [
  { label: "GitHub", href: "https://github.com/whyismeleige" },
  { label: "Email", href: `mailto:${site.email}` },
] as const;

export const nav = [
  { href: "/essays", label: "Essays", short: "Essays" },
  { href: "/work", label: "Work & Projects", short: "Work" },
] as const;
