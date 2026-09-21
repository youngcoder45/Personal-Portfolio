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
      { label: 'About · man aditya', icon: 'dir', href: '/#about' },
      { label: 'Toolchain', icon: 'dir', href: '/#toolchain' },
      { label: 'Projects', icon: 'dir', href: '/#projects' },
      { label: 'Notes', icon: 'dir', href: '/#notes' },
      { label: 'Environment · current rig', icon: 'dir', href: '/#environment' },
      { label: 'Contact', icon: 'dir', href: '/#contact' },
      { label: 'RSS feed', icon: 'rss', href: '/rss.xml' },
    ],
  },
  {
    title: 'Notes',
    items: [
      {
        label: 'A TUI with zero curses: raw C and termios',
        icon: 'note',
        href: '/notes/tui-without-curses/',
      },
      {
        label: 'GPIO as a state machine: bare-metal ESP32 in C vs Rust',
        icon: 'note',
        href: '/notes/esp32-registers/',
      },
      {
        label: 'Version your brain: dotfiles as infrastructure',
        icon: 'note',
        href: '/notes/dotfiles-infra/',
      },
      {
        label: 'What a compositor actually is (and why I run niri)',
        icon: 'note',
        href: '/notes/why-niri/',
      },
    ],
  },
  {
    title: 'Projects',
    items: [
      { label: 'Student-Performance-Predictor', icon: 'file', href: '/projects/student-performance-predictor/' },
      { label: 'OpenCV-Math-Solver', icon: 'file', href: '/projects/opencv-math-solver/' },
      { label: 'New-Niri-minimal-dots', icon: 'file', href: '/projects/new-niri-minimal-dots/' },
      { label: 'My-KDE-Dotfiles', icon: 'file', href: '/projects/my-kde-dotfiles/' },
      { label: 'discord-matrix-bridge', icon: 'file', href: '/projects/discord-matrix-bridge/' },
      { label: 'EclipseLinux', icon: 'file', href: '/projects/eclipse-linux/' },
      { label: 'Eigen-Bot', icon: 'file', href: '/projects/eigen-bot/' },
      { label: 'foundry', icon: 'file', href: '/projects/foundry/' },
      { label: 'niri-utils', icon: 'file', href: '/projects/niri-utils/' },
      { label: 'tonarchy', icon: 'file', href: '/projects/tonarchy/' },
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