export type Book = {
  id: string;
  title: string;
  author: string;
  category: string;
  tag: string;
  year: number;
  note: string;
};

/**
 * Curated bookshelf confirmed by the owner on 2026-11-12.
 * Real reading list - no invented star ratings, dates, or progress percentages.
 */
export const books: Book[] = [
  {
    id: 'atomic-habits',
    title: 'Atomic Habits',
    author: 'James Clear',
    category: 'Systems & Iteration',
    tag: 'systems',
    year: 2018,
    note: 'Compounding feedback loops, environment design, and systematic 1% gains applied to code and life.',
  },
  {
    id: 'power-of-subconscious-mind',
    title: 'The Power of Your Subconscious Mind',
    author: 'Joseph Murphy',
    category: 'Psychology & Focus',
    tag: 'psychology',
    year: 1963,
    note: 'Mental conditioning, self-discipline, and deep subconscious alignment for persistent problem-solving.',
  },
  {
    id: 'think-and-grow-rich',
    title: 'Think and Grow Rich',
    author: 'Napoleon Hill',
    category: 'Philosophy & Drive',
    tag: 'philosophy',
    year: 1937,
    note: 'Long-term intent, self-mastery, organized planning, and resilience across setbacks.',
  },
  {
    id: 'to-kill-a-mockingbird',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    category: 'Classic Literature',
    tag: 'literature',
    year: 1960,
    note: 'Moral courage, perspective-taking, quiet integrity, and principled defense of justice.',
  },
  {
    id: 'the-hunger-games',
    title: 'The Hunger Games',
    author: 'Suzanne Collins',
    category: 'Dystopian Fiction',
    tag: 'fiction',
    year: 2008,
    note: 'Power dynamics, resource scarcity, surveillance mechanics, and asymmetric strategy.',
  },
  {
    id: 'pride-and-prejudice',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    category: 'Classic Prose',
    tag: 'classics',
    year: 1813,
    note: 'Sharp social commentary, interpersonal dynamics, human observation, and cognitive bias.',
  },
];
