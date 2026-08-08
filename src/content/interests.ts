// My Interests, will keep on changing

export type Section = {
  slug: "music" | "books" | "movies" | "anime-manga";
  title: string;
};

export const interests: Section[] = [
  { slug: "books", title: "Books" },
  { slug: "music", title: "Music" },
  { slug: "movies", title: "Movies" },
  { slug: "anime-manga", title: "Anime & Manga" },
];

export type BookRef = { title: string; author?: string };

export const books: BookRef[] = [
  { title: "The Almanack of Naval Ravikant", author: "Eric Jorgenson" },
  { title: "Crime and Punishment", author: "Fyodor Dostoevsky" },
  { title: "Freedom from the Known", author: "Jiddu Krishnamurti" },
  { title: "Animal Farm", author: "George Orwell" },
  { title: "Skin in the Game", author: "Nassim Nicholas Taleb" },
  { title: "Dune", author: "Frank Herbert" },
];

export type MovieRef = { title: string };

export const movies: MovieRef[] = [
  { title: "Natsamrat" },
  { title: "End of Evangelion" },
  { title: "In the Mood for Love" },
  { title: "Pulp Fiction" },
  { title: "Taxi Driver" },
  { title: "Oldboy" },
];

export type MangaRef = { title: string; year?: string };

export const manga: MangaRef[] = [
  { title: "Usogui" },
  { title: "Berserk" },
  { title: "Kokou no Hito" },
  { title: "Monster", year: "1994" },
  { title: "Attack on Titan" },
  { title: "Vagabond" },
];
