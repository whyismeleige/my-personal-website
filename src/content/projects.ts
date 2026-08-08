import { socials } from "./site";

export const currently = {
  headline: "Currently",
  items: [
    "Building this site, and finally writing the essays it was an excuse for.",
    "Reading about consensus protocols until they stop feeling like magic.",
    "Open to interesting problems — reach out.",
  ],
};

export type Project = {
  title: string;
  year: string;
  body: string;
  stack: string[];
  links?: { label: string; href: string }[];
};

export const projects: Project[] = [
  {
    title: "Marrai - AI Visibility Audit Tool", 
    year: "2026",
    body: "Marrai, was my startup idea for building an AI Visibility Audit in India, but I dropped it for personal reasons.",
    stack: [],
    links: [{
      label: "Frontend",
      href: `${socials.GitHub}/marrai-web`, 
    }, {
        label: "Backend",
        href: `${socials.GitHub}/marrai-backend`
      }]
  }
];
