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

export const projects: Project[] = [];
