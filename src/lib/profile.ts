export const identity = {
  name: 'Aditya Verma',
  handle: 'youngcoder45',
  title: 'Systems & Backend Developer',
  sub: 'Electronics Engineering Student · FOSS Maintainer',
  location: 'Mumbai, India',
  tz: 'UTC+05:30 (IST)',
  github: 'https://github.com/youngcoder45',
  repo: 'https://github.com/youngcoder45/portfolio',
  issues: 'https://github.com/youngcoder45/youngcoder45/issues',
  site: 'https://aditya-verma.me',
  orcid: 'https://orcid.org/0009-0002-2090-9265',
  blog: 'https://aditya-verma.me',
} as const;

export const socials: { label: string; href: string; hint: string }[] = [
  { label: 'github', href: 'https://github.com/youngcoder45', hint: 'youngcoder45' },
  { label: 'linkedin', href: 'https://www.linkedin.com/in/youngcoder45/', hint: 'youngcoder45' },
  { label: 'x', href: 'https://x.com/youngcoder45', hint: '@youngcoder45' },
  { label: 'mastodon', href: 'https://mastodon.social/@youngcoder45', hint: '@youngcoder45' },
  { label: 'orcid', href: 'https://orcid.org/0009-0002-2090-9265', hint: '0009-0002-2090-9265' },
  { label: 'community', href: 'https://github.com/TheCodeVerseHub', hint: '@TheCodeVerseHub' },
  { label: 'issues', href: 'https://github.com/youngcoder45/youngcoder45/issues', hint: 'github/youngcoder45/issues' },
] as const;

export const nav = [
  { id: 'about', label: 'man aditya', path: '#about' },
  { id: 'toolchain', label: 'toolchain', path: '#toolchain' },
  { id: 'projects', label: 'projects', path: '#projects' },
  { id: 'notes', label: 'notes', path: '/notes' },
  { id: 'contact', label: 'contact', path: '#contact' },
] as const;

export const tagline = ['Code.', 'Study.', 'Research.', 'Repeat.'] as const;

export const neofetch = {
  art: [
    '⠀⠀⠀⠀⣀⡀',
    '⠀⠀⠀⠀⣿⠙⣦⠀⠀⠀⠀⠀⠀⣀⣤⡶⠛⠁',
    '⠀⠀⠀⠀⢻⠀⠈⠳⠀⠀⣀⣴⡾⠛⠁⣠⠂⢠⠇',
    '⠀⠀⠀⠀⠈⢀⣀⠤⢤⡶⠟⠁⢀⣴⣟⠀⠀⣾',
    '⠀⠀⠀⠠⠞⠉⢁⠀⠉⠀⢀⣠⣾⣿⣏⠀⢠⡇',
    '⠀⠀⡰⠋⠀⢰⠃⠀⠀⠉⠛⠿⠿⠏⠁⠀⣸⠁',
    '⠀⠀⣄⠀⠀⠏⣤⣤⣀⡀⠀⠀⠀⠀⠀⠾⢯⣀',
    '⠀⠀⣻⠃⠀⣰⡿⠛⠁⠀⠀⠀⢤⣀⡀⠀⠺⣿⡟⠛⠁',
    '⠀⡠⠋⡤⠠⠋⠀⠀⢀⠐⠁⠀⠈⣙⢯⡃⠀⢈⡻⣦',
    '⢰⣷⠇⠀⠀⠀⢀⡠⠃⠀⠀⠀⠀⠈⠻⢯⡄⠀⢻⣿⣷',
    '⠀⠉⠲⣶⣶⢾⣉⣐⡚⠋⠀⠀⠀⠀⠀⠘⠀⠀⡎⣿⣿⡇',
    '⠀⠀⠀⠀⠀⠀⣸⣿⣿⣿⣷⡄⠀⠀⢠⣿⣴⠀⠀⣿⣿⣿⣧',
    '⠀⠀⠀⢀⣴⣿⣿⣿⣿⣿⠇⠀⢠⠟⣿⠏⢀⣾⠟⢸⣿⡇',
    '⠀⠀⢠⣿⣿⣿⣿⠟⠘⠁⢠⠜⢉⣐⡥⠞⠋⢁⣴⣿⣿⠃',
    '⠀⠀⣾⢻⣿⣿⠃⠀⠀⡀⢀⡄⠁⠀⠀⢠⡾⠁',
    '⠀⠀⠃⢸⣿⡇⠀⢠⣾⡇⢸⡇⠀⠀⠀⡞',
    '⠀⠀⠀⠈⢿⡇⡰⠋⠈⠙⠂⠙⠢',
    '⠀⠀⠀⠀⠈⢧',
  ],
  label: 'aditya@arch',
  info: [
    'User        aditya',
    'Distro      Arch Linux x86_64',
    'Kernel      Linux 7.2.6-arch2-1',
    'Uptime      1 hour, 28 mins',
    'WM          niri 26.04 (Wayland)',
    'Terminal    alacritty 0.17.0',
    'Shell       fish 4.9.3',
    'Font        ui-monospace (system mono stack)',
    'Pkgs        120 (aditya-shell)',
  ],
  colors: [
    '#3b4252',
    '#bf616a',
    '#a3be8c',
    '#ebcb8b',
    '#81a1c1',
    '#b48ead',
    '#88c0d0',
    '#e5e9f0',
  ],
} as const;

export const rig = [
  ['OS', 'Arch Linux · Void (EclipseLinux)'],
  ['init', 'systemd / Dynamod (custom)'],
  ['WM', 'niri — scrolling Wayland compositor'],
  ['Shell', 'zsh + fish'],
  ['Prompt', 'starship-ish, hand-rolled'],
  ['Editor', 'Neovim (Lua) + Zed + VS Code'],
  ['Terminal', 'kitty'],
  ['Dotfiles', 'git-tracked, on GitHub'],
  ['Rice', 'minimal, functional, cursed-clean'],
  ['Board', 'ESP32 · Arduino · Raspberry Pi'],
  ['Arch', 'x86_64'],
] as const;