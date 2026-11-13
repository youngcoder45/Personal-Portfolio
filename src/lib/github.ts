/**
 * Build-time GitHub telemetry with honest fallbacks.
 *
 * Everything here runs during the static build only — no token, no network
 * call, and no fetch code ever reaches the client bundle. Every failure
 * degrades to labelled, authored data instead of failing the build:
 *
 * - `GITHUB_TOKEN` (optional) unlocks the contribution calendar via the
 *   GraphQL API. Without it the calendar is simply unavailable and the UI
 *   says so explicitly.
 * - Repo star counts and the public-repo count are fetched from the public
 *   REST API (authenticated if a token exists, anonymous otherwise) for both
 *   repo owners (`youngcoder45` and the `TheCodeVerseHub` org).
 * - A fresh result is cached in `node_modules/.cache/av-github.json` (which
 *   Netlify preserves between builds); a fetch failure falls back to a stale
 *   cache when one exists, otherwise callers render their authored values
 *   with a "curated" label.
 */
import { identity } from './profile';

export type CalDay = { date: string; count: number; level: number };

export type ContributionCalendar = {
  total: number;
  /** Weeks in calendar order; each week is 7 days, Sunday first. */
  weeks: CalDay[][];
  start: string;
  end: string;
};

export type GitHubData = {
  fetchedAt: string;
  source: 'token' | 'public';
  publicRepos: number | null;
  /** Star counts keyed by `owner/repo`. */
  repoStars: Record<string, number>;
  calendar: ContributionCalendar | null;
};

const OWNER = identity.handle; // 'youngcoder45'
const ORGS = ['TheCodeVerseHub'];
const TIMEOUT_MS = 10_000;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const CACHE_FILE = 'av-github.json';

/** `https://github.com/owner/repo(.git)?` → `owner/repo`, else null. */
export function repoFullName(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname !== 'github.com' && u.hostname !== 'www.github.com') return null;
    const parts = u.pathname.split('/').filter(Boolean);
    if (parts.length < 2) return null;
    return `${parts[0]}/${parts[1].replace(/\.git$/, '')}`;
  } catch {
    return null;
  }
}

/**
 * Resolve the star count for a repo with its honest origin: a live value
 * fetched at build time, or the authored count labelled "curated".
 */
export function resolveStars(
  repoStars: Record<string, number> | null | undefined,
  repoUrl: string,
  curated: number,
): { count: number; live: boolean } {
  const full = repoFullName(repoUrl);
  const live = full !== null && repoStars ? repoStars[full] : undefined;
  if (typeof live === 'number') return { count: live, live: true };
  return { count: curated, live: false };
}

/** Human-readable "13 Nov 2026" label for when data was fetched. */
export function fetchedOn(data: GitHubData | null): string | null {
  if (!data) return null;
  const d = new Date(data.fetchedAt);
  if (Number.isNaN(d.getTime())) return null;
  return `${d.getDate()} ${d.toLocaleString('en-GB', { month: 'short' })} ${d.getFullYear()}`;
}

function token(): string | null {
  const raw = (import.meta.env.GITHUB_TOKEN ?? process.env.GITHUB_TOKEN ?? '') as string;
  const t = typeof raw === 'string' ? raw.trim() : '';
  return t.length > 0 ? t : null;
}

async function ghFetch(url: string, authToken: string | null, init?: RequestInit): Promise<Response> {
  const headers: Record<string, string> = {
    accept: 'application/vnd.github+json',
    'user-agent': 'aditya-verma-portfolio (build script)',
  };
  if (authToken) headers.authorization = `Bearer ${authToken}`;
  return fetch(url, {
    ...init,
    headers: { ...headers, ...(init?.headers as Record<string, string> | undefined) },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
}

async function fetchRepoStars(authToken: string | null): Promise<Record<string, number>> {
  const map: Record<string, number> = {};
  const owners = [OWNER, ...ORGS];
  for (const owner of owners) {
    const res = await ghFetch(
      `https://api.github.com/users/${owner}/repos?per_page=100&sort=pushed`,
      authToken,
    );
    if (!res.ok) throw new Error(`repos for ${owner}: HTTP ${res.status}`);
    const list = (await res.json()) as Array<{ full_name?: string; stargazers_count?: number }>;
    if (!Array.isArray(list)) throw new Error(`repos for ${owner}: unexpected payload`);
    for (const r of list) {
      if (typeof r.full_name === 'string' && typeof r.stargazers_count === 'number') {
        map[r.full_name] = r.stargazers_count;
      }
    }
  }
  return map;
}

async function fetchPublicRepos(authToken: string | null): Promise<number | null> {
  const res = await ghFetch(`https://api.github.com/users/${OWNER}`, authToken);
  if (!res.ok) throw new Error(`user ${OWNER}: HTTP ${res.status}`);
  const body = (await res.json()) as { public_repos?: number };
  return typeof body.public_repos === 'number' ? body.public_repos : null;
}

const LEVELS: Record<string, number> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

async function fetchCalendar(authToken: string | null): Promise<ContributionCalendar | null> {
  if (!authToken) return null; // calendar needs GraphQL; no fragile public-page scraping
  const res = await ghFetch('https://api.github.com/graphql', authToken, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      query: `query($login: String!) {
        user(login: $login) {
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays { date contributionCount contributionLevel }
              }
            }
          }
        }
      }`,
      variables: { login: OWNER },
    }),
  });
  if (!res.ok) throw new Error(`calendar: HTTP ${res.status}`);
  const body = (await res.json()) as {
    data?: {
      user?: {
        contributionsCollection?: {
          contributionCalendar?: {
            totalContributions?: number;
            weeks?: Array<{
              contributionDays?: Array<{ date?: string; contributionCount?: number; contributionLevel?: string }>;
            }>;
          };
        };
      };
    };
    errors?: unknown;
  };
  const cal = body.data?.user?.contributionsCollection?.contributionCalendar;
  if (!cal?.weeks) throw new Error('calendar: missing data');
  const weeks: CalDay[][] = cal.weeks.map((w) =>
    (w.contributionDays ?? []).map((d) => ({
      date: typeof d.date === 'string' ? d.date : '',
      count: typeof d.contributionCount === 'number' ? d.contributionCount : 0,
      level: LEVELS[d.contributionLevel ?? 'NONE'] ?? 0,
    })),
  );
  const dates = weeks.flat().map((d) => d.date).filter(Boolean);
  return {
    total: typeof cal.totalContributions === 'number' ? cal.totalContributions : 0,
    weeks,
    start: dates[0] ?? '',
    end: dates[dates.length - 1] ?? '',
  };
}

async function cacheFile(): Promise<string | null> {
  try {
    const path = await import('node:path');
    return path.join(process.cwd(), 'node_modules', '.cache', CACHE_FILE);
  } catch {
    return null;
  }
}

async function readCache(): Promise<GitHubData | null> {
  try {
    const fs = await import('node:fs/promises');
    const file = await cacheFile();
    if (!file) return null;
    const raw = await fs.readFile(file, 'utf8');
    const data = JSON.parse(raw) as GitHubData;
    if (!data || typeof data.fetchedAt !== 'string') return null;
    return data;
  } catch {
    return null;
  }
}

async function writeCache(data: GitHubData): Promise<void> {
  try {
    const [fs, path] = await Promise.all([import('node:fs/promises'), import('node:path')]);
    const file = path.join(process.cwd(), 'node_modules', '.cache', CACHE_FILE);
    await fs.mkdir(path.dirname(file), { recursive: true });
    await fs.writeFile(file, JSON.stringify(data));
  } catch {
    /* cache is best-effort */
  }
}

let memo: Promise<GitHubData | null> | null = null;

async function load(): Promise<GitHubData | null> {
  const cached = await readCache();
  if (cached && Date.now() - Date.parse(cached.fetchedAt) < CACHE_TTL_MS) return cached;

  const authToken = token();
  try {
    const [repoStars, publicRepos, calendar] = await Promise.all([
      fetchRepoStars(authToken),
      fetchPublicRepos(authToken),
      fetchCalendar(authToken),
    ]);
    const data: GitHubData = {
      fetchedAt: new Date().toISOString(),
      source: authToken ? 'token' : 'public',
      publicRepos,
      repoStars,
      calendar,
    };
    await writeCache(data);
    console.log(
      `[github] fetched ${Object.keys(repoStars).length} repo star counts via ${authToken ? 'token' : 'anonymous'} API; calendar: ${calendar ? 'ok' : 'unavailable'}`,
    );
    return data;
  } catch (err) {
    console.warn(
      `[github] fetch failed (${err instanceof Error ? err.message : String(err)}); using ${cached ? 'stale cache' : 'authored fallbacks'}`,
    );
    return cached ?? null;
  }
}

/** Memoized build-time load. Never throws; returns null when nothing worked. */
export function loadGitHubData(): Promise<GitHubData | null> {
  if (!memo) memo = load();
  return memo;
}
