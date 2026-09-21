import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { identity } from '../lib/profile';

export const prerender = true;

export async function GET(context: { site: URL }) {
  const notes = (await getCollection('notes'))
    .filter((n) => !n.data.draft)
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return rss({
    title: `${identity.name} — ~/notes`,
    description: 'Field notes, write-ups and postmortems from a systems & backend developer.',
    site: context.site,
    items: notes.map((note) => ({
      title: note.data.title,
      pubDate: note.data.pubDate,
      description: note.data.description,
      link: `/notes/${note.id}/`,
    })),
    customData: `<language>en-us</language>`,
  });
}