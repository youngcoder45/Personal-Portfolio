import type { CollectionEntry } from 'astro:content';

export type ProjectEntry = CollectionEntry<'projects'>;
export type ProjectData = ProjectEntry['data'];

/** Display order for category and status facets. */
export const categoryOrder = [
  'systems',
  'linux',
  'embedded',
  'backend',
  'data',
  'devtools',
  'web',
  'foss',
] as const;

export const statusOrder = ['active', 'maintained', 'experimental', 'archived'] as const;

export type Facet = { value: string; count: number };

/** Deterministic ordering: stars first, then title. */
export function byStars(a: ProjectEntry, b: ProjectEntry): number {
  return b.data.stars - a.data.stars || a.data.title.localeCompare(b.data.title);
}

/** Options for a filter group, restricted to values that actually occur. */
export function facets(projects: ProjectEntry[], key: 'category' | 'status'): Facet[] {
  const counts = new Map<string, number>();
  for (const project of projects) {
    const value = project.data[key];
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  const order = key === 'category' ? categoryOrder : statusOrder;
  return order
    .filter((value) => counts.has(value))
    .map((value) => ({ value, count: counts.get(value) ?? 0 }));
}

/** Years, newest first, with the projects belonging to each. */
export function groupByYear(projects: ProjectEntry[]): { year: number; projects: ProjectEntry[] }[] {
  const buckets = new Map<number, ProjectEntry[]>();
  for (const project of projects) {
    const list = buckets.get(project.data.year) ?? [];
    list.push(project);
    buckets.set(project.data.year, list);
  }
  return [...buckets.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([year, list]) => ({ year, projects: list.sort(byStars) }));
}

/**
 * Related projects from shared tags and category. Language only breaks ties, so
 * "written in Python" alone is not enough to be considered related.
 */
export function relatedProjects(
  project: ProjectEntry,
  all: ProjectEntry[],
  limit = 3,
): ProjectEntry[] {
  const tags = new Set(project.data.tags);
  return all
    .filter((candidate) => candidate.id !== project.id)
    .map((candidate) => {
      const sharedTags = candidate.data.tags.filter((tag) => tags.has(tag)).length;
      const sameCategory = candidate.data.category === project.data.category ? 1 : 0;
      const sameLanguage = candidate.data.language === project.data.language ? 1 : 0;
      return {
        candidate,
        score: sharedTags * 3 + sameCategory * 2,
        sameLanguage,
      };
    })
    .filter((entry) => entry.score >= 2)
    .sort(
      (a, b) =>
        b.score - a.score ||
        b.sameLanguage - a.sameLanguage ||
        b.candidate.data.stars - a.candidate.data.stars ||
        a.candidate.data.title.localeCompare(b.candidate.data.title),
    )
    .slice(0, limit)
    .map((entry) => entry.candidate);
}

export function cloneCommand(project: ProjectEntry): string {
  return `git clone ${project.data.repo.replace(/\/$/, '')}.git`;
}
