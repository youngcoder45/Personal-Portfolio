export type SearchItem = {
  label: string;
  icon: string;
  href?: string;
  action?: 'view-source' | 'copy';
};

export type SearchGroup = {
  title: string;
  items: SearchItem[];
};

export const SEARCH_GROUPS: SearchGroup[] = [
  {
    title: 'Pages',
    items: [
      { label: 'Home', icon: 'home', href: '/' },
      { label: 'About · man aditya', icon: 'dir', href: '/about' },
      { label: 'Toolchain', icon: 'dir', href: '/#toolchain' },
      { label: 'Projects', icon: 'dir', href: '/#projects' },
      { label: 'Notes', icon: 'dir', href: '/#notes' },
      { label: 'Environment · current rig', icon: 'dir', href: '/#environment' },
      { label: 'Contact', icon: 'dir', href: '/#contact' },
      { label: 'RSS feed', icon: 'rss', href: '/rss.xml' },
    ],
  },
  {
    title: 'Actions',
    items: [
      { label: 'View Source', icon: 'terminal', action: 'view-source' },
      { label: 'Copy page URL', icon: 'copy', action: 'copy' },
      { label: 'Open GitHub', icon: 'github', href: 'https://github.com/youngcoder45' },
    ],
  },
];

export const PALETTE_HINT = 'Cmd K';