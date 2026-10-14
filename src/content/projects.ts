import { socials } from "./site";

export type ProjectLink = { label: string; href: string };
export type Project = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  links?: ProjectLink[];
};

export const projects: Project[] = [
  {
    slug: "ride-saathi",
    title: "ride saathi",
    subtitle: "voice-first ride booking for older adults.",
    description:
      "a multilingual voice interface that helps older adults choose a destination conversationally, confirm the details and hand the ride off to uber.",
    tags: ["voice ai", "fastapi", "android", "google cloud"],
    links: [
      {
        label: "website",
        href: "https://ridesaathi.piyushbuilds.me",
      },
      {
        label: "repo",
        href: `${socials.github}/ride-saathi`,
      },
    ],
  },
  {
    slug: "marrai",
    title: "marrai",
    subtitle: "ai visibility auditing at scale.",
    description:
      "an auditing system for measuring how brands appear across ai answer engines, capable of running thousands of prompts with background jobs and structured analysis.",
    tags: ["fastapi", "postgresql", "redis", "celery", "llms"],
    links: [
      { label: "website", href: "https://marrai.tech" },
      { label: "frontend repo", href: `${socials.github}/marrai-web` },
      { label: "backend repo", href: `${socials.github}/marrai-backend` },
    ],
  },
  {
    slug: "sjc-result-hub",
    title: "sjc result hub",
    subtitle: "a faster way to explore academic results and leaderboards.",
    description:
      "a full-stack result exploration platform that turns structured academic data into searchable views, filters and leaderboards.",
    tags: ["next.js", "postgresql", "prisma", "supabase", "vercel"],
  },
];

export const featuredProjects = projects;
export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
