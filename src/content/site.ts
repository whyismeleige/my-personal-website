export const site = {
  name: "Piyush Jain",
  handle: "piyushbuilds",
  description:
    "Independent software developer building full-stack products, AI systems and automation.",
  email: "personal.piyushjain@gmail.com",
  url: "https://piyushbuilds.me",
  locale: "en_IN",
  location: "Hyderabad, India",
  availability: "Available for freelance projects.",
  intro:
    "I build software, from SaaS products and internal tools to AI systems, automations and weird ideas that probably shouldn’t work but do.",
} as const;

export const socials = {
  LinkedIn: "https://www.linkedin.com/in/piyush-jain-2005-/",
  GitHub: "https://github.com/whyismeleige",
  Email: `mailto:${site.email}`,
} as const;

export const nav = [
  { href: "/work", label: "Work" },
  { href: "/essays", label: "Writing" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export const capabilities = [
  {
    title: "Build your MVP",
    body: "Turn an idea or specification into a working web product.",
  },
  {
    title: "Full-stack development",
    body: "Build or extend production web applications, APIs and databases.",
  },
  {
    title: "AI features",
    body: "Add LLMs, AI workflows, voice interfaces or intelligent automation to a product.",
  },
  {
    title: "Automation",
    body: "Replace repetitive workflows with APIs, scripts, browser automation and n8n.",
  },
  {
    title: "Internal tools",
    body: "Build focused software for work that spreadsheets and off-the-shelf tools don’t handle well.",
  },
] as const;

export const tools = [
  { group: "Web", items: "Next.js, React, TypeScript, Tailwind CSS" },
  { group: "Backend", items: "Python, FastAPI, Node.js, PostgreSQL, Redis" },
  { group: "AI", items: "LLM APIs, AI Agents, Vector Databases" },
  { group: "Infrastructure", items: "Linux, Docker, Supabase, Vercel, Cloud" },
  { group: "Automation", items: "n8n, Puppeteer, scripts and APIs" },
] as const;
