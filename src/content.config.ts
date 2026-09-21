import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    blurb: z.string(),
    year: z.number(),
    language: z.string(),
    category: z.enum([
      'systems',
      'linux',
      'embedded',
      'backend',
      'data',
      'devtools',
      'web',
      'foss',
    ]),
    stack: z.array(z.string()),
    tags: z.array(z.string()),
    stars: z.number().default(0),
    repo: z.string().url(),
    demo: z.string().url().optional(),
    star: z.boolean().default(false),
    status: z
      .enum(['active', 'maintained', 'archived', 'experimental'])
      .default('active'),
    featured: z.boolean().default(false),
    org: z.boolean().default(false),
  }),
});

const notes = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()),
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects, notes };