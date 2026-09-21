import { socials } from "./site";

export type ProjectSection = { title: string; paragraphs: string[] };
export type Project = {
  slug: string;
  title: string;
  year?: string;
  summary: string;
  description: string;
  stack: string[];
  featured: boolean;
  links?: { label: string; href: string }[];
  sections: ProjectSection[];
};

export const projects: Project[] = [
  {
    slug: "ride-saathi",
    title: "Ride Saathi",
    summary: "Voice-first ride booking for older adults.",
    description:
      "A multilingual voice interface that helps older adults choose a destination conversationally, confirm the details and hand the ride off to Uber.",
    stack: ["Voice AI", "FastAPI", "Android", "Google Cloud"],
    featured: true,
    sections: [
      {
        title: "Context / Problem",
        paragraphs: [
          "Ride-booking apps ask people to navigate dense screens, search interfaces and small controls. That can turn a routine trip into a frustrating task for older adults.",
          "Ride Saathi explores a simpler interface: talk naturally, confirm what the system understood and continue into the familiar ride service.",
        ],
      },
      {
        title: "What I built",
        paragraphs: [
          "I built an Android client and Python backend for a multilingual conversation in English, Hindi and Telugu. The flow supports saved places, destination configuration, explicit confirmation and an Uber deep-link handoff.",
        ],
      },
      {
        title: "How it works",
        paragraphs: [
          "Audio moves over WebSockets to a FastAPI service. Speech-to-text turns it into input for the conversation, an LLM reasons about the request, and text-to-speech returns a spoken response. Pipecat helps coordinate the real-time voice pipeline.",
        ],
      },
      {
        title: "Interesting engineering problems",
        paragraphs: [
          "Voice UX has to make uncertainty visible without becoming exhausting. The important work was not just connecting speech services; it was designing a forgiving stateful flow where a person can correct a destination and hear a clear confirmation before leaving the app.",
        ],
      },
    ],
  },
  {
    slug: "marrai",
    title: "marrai",
    year: "2026",
    summary: "AI visibility auditing at scale.",
    description:
      "An auditing system for measuring how brands appear across AI answer engines, capable of running thousands of prompts with background jobs and structured analysis.",
    stack: ["FastAPI", "PostgreSQL", "Redis", "Celery", "LLMs"],
    featured: true,
    links: [
      { label: "Frontend on GitHub", href: `${socials.GitHub}/marrai-web` },
      { label: "Backend on GitHub", href: `${socials.GitHub}/marrai-backend` },
    ],
    sections: [
      {
        title: "Context / Problem",
        paragraphs: [
          "Search is no longer the only place people discover products. They ask AI systems for categories, comparisons and recommendations, but it is difficult for a brand to see where it appears across those answers.",
        ],
      },
      {
        title: "What I built",
        paragraphs: [
          "marrai was my startup idea for an AI visibility audit product in India. I built the system for defining audits, executing large prompt sets and turning inconsistent model responses into structured results that can be explored.",
          "I eventually stopped working on the startup for personal reasons, but the engineering remains a useful example of designing an AI product beyond a single prompt-and-response screen.",
        ],
      },
      {
        title: "Technical decisions",
        paragraphs: [
          "FastAPI exposes the product API while Celery and Redis move long-running model calls out of the request path. PostgreSQL stores audit definitions and normalized results. Embeddings support analysis across responses rather than treating every answer as an isolated blob of text.",
        ],
      },
      {
        title: "Interesting engineering problems",
        paragraphs: [
          "Executing thousands of prompts means dealing with concurrency, retries, rate limits and partial failures. The system needed to make progress observable and preserve useful results even when an individual provider call failed.",
        ],
      },
    ],
  },
  {
    slug: "sjc-result-hub",
    title: "SJC Result Hub",
    summary: "A faster way to explore academic results and leaderboards.",
    description:
      "A full-stack result exploration platform that turns structured academic data into searchable views, filters and leaderboards.",
    stack: ["Next.js", "PostgreSQL", "Prisma", "Supabase", "Vercel"],
    featured: true,
    sections: [
      {
        title: "Context / Problem",
        paragraphs: [
          "Academic results are useful as data, but awkward to understand when they live in static documents or disconnected lists. Comparing subjects, people and ranks should not require manual searching.",
        ],
      },
      {
        title: "What I built",
        paragraphs: [
          "I built a full-stack web application for exploring structured result data. It combines focused filters with leaderboard views so a user can move quickly from a broad result set to the detail they need.",
        ],
      },
      {
        title: "Technical decisions",
        paragraphs: [
          "Next.js handles the application and server-rendered interface. PostgreSQL and Prisma provide a clear relational model for academic data, with Supabase hosting the database and Vercel serving the application.",
        ],
      },
      {
        title: "Interesting engineering problems",
        paragraphs: [
          "The core problem is data shape: importing inconsistent academic records into a dependable model, then designing queries that keep multi-dimensional filtering and rankings fast and understandable.",
        ],
      },
    ],
  },
];

export const featuredProjects = projects.filter((project) => project.featured);
export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
