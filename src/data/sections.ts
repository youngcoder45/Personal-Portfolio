export type SectionId =
  | 'about'
  | 'toolchain'
  | 'projects'
  | 'notes'
  | 'environment'
  | 'contact';

export type PortfolioSection = {
  id: SectionId;
  index: string;
  label: string;
  title: string;
  path: string;
  enabled: boolean;
};

/**
 * Homepage section order and visibility. This is the single source of truth
 * for the section rail, the mobile section index, and the homepage renderer.
 */
export const portfolioSections: PortfolioSection[] = [
  {
    id: 'about',
    index: '01',
    label: 'about',
    title: 'man aditya',
    path: '~/.local/share/man/man1/aditya(1)',
    enabled: true,
  },
  {
    id: 'toolchain',
    index: '02',
    label: 'toolchain',
    title: 'toolchain',
    path: '~/.config/aditya/toolchain.json',
    enabled: true,
  },
  {
    id: 'projects',
    index: '03',
    label: 'projects',
    title: 'projects',
    path: '~/projects/*.mdx',
    enabled: true,
  },
  {
    id: 'notes',
    index: '04',
    label: 'notes',
    title: 'notes',
    path: '~/notes/{registry,field,postmortem}.mdx',
    enabled: true,
  },
  {
    id: 'environment',
    index: '05',
    label: 'environment',
    title: 'environment',
    path: '/proc/aditya/environ',
    enabled: true,
  },
  {
    id: 'contact',
    index: '06',
    label: 'contact',
    title: 'contact',
    path: '~/.local/share/aditya/contact',
    enabled: true,
  },
];

export const enabledSections = portfolioSections.filter((section) => section.enabled);

export type RailId = SectionId | 'boot';

export type RailSection = {
  id: RailId;
  index: string;
  label: string;
  path: string;
};

export const heroSection = {
  id: 'boot',
  index: '00',
  label: 'boot',
  path: '~/',
} as const satisfies RailSection;

export const railSections: RailSection[] = [heroSection, ...enabledSections];
