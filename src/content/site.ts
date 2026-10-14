export const site = {
  name: "piyush jain",
  handle: "piyushbuilds",
  description:
    "independent software developer building full-stack products, ai systems and automation.",
  email: "personal.piyushjain@gmail.com",
  url: "https://piyushbuilds.me",
  locale: "en_IN",
  location: "hyderabad, india",
  intro: "i really like to build stuff.",
} as const;

export const socials = {
  linkedin: "https://www.linkedin.com/in/piyush-jain-2005-/",
  github: "https://github.com/whyismeleige",
  substack: "https://substack.com/@pyushjain",
  email: `mailto:${site.email}`,
} as const;

export const nav = [
  { href: "/work", label: "work" },
  { href: "https://substack.com/@pyushjain", label: "writing" },
  { href: "/about", label: "about" },
  { href: "/contact", label: "contact" },
] as const;

export const capabilities = [
  {
    title: "build your mvp",
    body: "turn an idea or specification into a working web product.",
  },
  {
    title: "full-stack development",
    body: "build or extend production web applications, apis and databases.",
  },
  {
    title: "ai features",
    body: "add llms, ai workflows, voice interfaces or intelligent automation to a product.",
  },
  {
    title: "automation",
    body: "replace repetitive workflows with apis, scripts, browser automation and n8n.",
  },
  {
    title: "internal tools",
    body: "build focused software for work that spreadsheets and off-the-shelf tools don't handle well.",
  },
] as const;

export const tools = [
  { group: "web", items: "next.js, react, typescript, tailwind css" },
  { group: "backend", items: "python, fastapi, node.js, postgresql, redis" },
  { group: "ai", items: "llm apis, ai agents, vector databases" },
  { group: "infrastructure", items: "linux, docker, supabase, vercel, cloud" },
  { group: "automation", items: "n8n, puppeteer, scripts and apis" },
] as const;
