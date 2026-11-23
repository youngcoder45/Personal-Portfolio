export const identity = {
  name: "Aditya Verma",
  handle: "youngcoder45",
  title: "Systems & Backend Developer",
  sub: "Electronics Engineering Student · FOSS Maintainer",
  location: "Mumbai, India",
  tz: "UTC+05:30 (IST)",
  github: "https://github.com/youngcoder45",
  repo: "https://github.com/youngcoder45/Personal-Portfolio",
  issues: "https://github.com/youngcoder45/youngcoder45/issues",
  site: "https://aditya-verma.me",
  orcid: "https://orcid.org/0009-0002-2090-9265",
  blog: "https://aditya-verma.me",
  discord: "https://discord.gg/3xKFvKhuGR",
} as const;

/**
 * Snapshot of GitHub counts confirmed by the owner on 2026-11-12.
 * Phase 4 replaces the public repo count with a build-time fetch when a
 * GITHUB_TOKEN is available; until then the UI labels it with `asOf`.
 */
export const githubStats = {
  publicRepos: 52,
  totalRepos: 78,
  asOf: "November 2026",
  /** Star count of this site's own source repo, confirmed via the public
   * GitHub API on 2026-11-13. Phase 4 replaces this with a build-time fetch. */
  repoStars: 5,
} as const;

export const socials: { label: string; href: string; hint: string }[] = [
  {
    label: "Github",
    href: "https://github.com/youngcoder45",
    hint: "youngcoder45",
  },
  {
    label: "Linkedin",
    href: "https://www.linkedin.com/in/youngcoder45/",
    hint: "youngcoder45",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/youngcoder45/",
    hint: "@youngcoder45",
  },
  { label: "X", href: "https://x.com/youngcoder45", hint: "@youngcoder45" },
  {
    label: "Mastodon",
    href: "https://mastodon.social/@youngcoder45",
    hint: "@youngcoder45",
  },
  {
    label: "OCRid",
    href: "https://orcid.org/0009-0002-2090-9265",
    hint: "0009-0002-2090-9265",
  },
  {
    label: "Organisation",
    href: "https://github.com/TheCodeVerseHub",
    hint: "@TheCodeVerseHub",
  },
  {
    label: "Email",
    href: "mailto:contact@aditya-verma.me",
    hint: "contact@aditya-verma.me",
  },
] as const;

/** Additional profile links shown in the command palette (the contact
 * section keeps rendering `socials`; these extend the palette only). */
export const extraLinks: { label: string; href: string; hint: string }[] = [
  {
    label: "Dev.to",
    href: "https://dev.to/youngcoder45",
    hint: "@youngcoder45",
  },
  {
    label: "daily.dev",
    href: "https://daily.dev/youngcoder45",
    hint: "youngcoder45",
  },
  {
    label: "Peerlist",
    href: "https://peerlist.io/youngcoder45",
    hint: "youngcoder45",
  },
  {
    label: "Bluesky",
    href: "https://bsky.app/profile/youngcoder45.bsky.social",
    hint: "@youngcoder45.bsky.social",
  },
  {
    label: "Medium",
    href: "https://medium.com/@youngcoder45",
    hint: "@youngcoder45",
  },
  {
    label: "Hashnode",
    href: "https://hashnode.com/@youngcoder45",
    hint: "@youngcoder45",
  },
  {
    label: "Kaggle",
    href: "https://www.kaggle.com/youngcoder45",
    hint: "youngcoder45",
  },
] as const;

/** Full link set for the command palette: every social plus the extras. */
export const paletteLinks: { label: string; href: string; hint: string }[] = [
  ...socials,
  ...extraLinks,
];

export type NavItem = {
  id: string;
  label: string;
  path: string;
  /** `route` navigates to a page; `anchor` targets a section on the homepage. */
  kind: "route" | "anchor";
};

export const nav: NavItem[] = [
  { id: "about", label: "whoami", path: "/about", kind: "route" },
  { id: "toolchain", label: "toolchain", path: "/#toolchain", kind: "anchor" },
  { id: "projects", label: "projects", path: "/projects", kind: "route" },
  { id: "notes", label: "notes", path: "/notes", kind: "route" },
  { id: "contact", label: "contact", path: "/#contact", kind: "anchor" },
];

export const tagline = ["Code.", "Study.", "Research.", "Repeat."] as const;

export const neofetch = {
  art: [
    "⠀⠀⠀⠀⣀⡀",
    "⠀⠀⠀⠀⣿⠙⣦⠀⠀⠀⠀⠀⠀⣀⣤⡶⠛⠁",
    "⠀⠀⠀⠀⢻⠀⠈⠳⠀⠀⣀⣴⡾⠛⠁⣠⠂⢠⠇",
    "⠀⠀⠀⠀⠈⢀⣀⠤⢤⡶⠟⠁⢀⣴⣟⠀⠀⣾",
    "⠀⠀⠀⠠⠞⠉⢁⠀⠉⠀⢀⣠⣾⣿⣏⠀⢠⡇",
    "⠀⠀⡰⠋⠀⢰⠃⠀⠀⠉⠛⠿⠿⠏⠁⠀⣸⠁",
    "⠀⠀⣄⠀⠀⠏⣤⣤⣀⡀⠀⠀⠀⠀⠀⠾⢯⣀",
    "⠀⠀⣻⠃⠀⣰⡿⠛⠁⠀⠀⠀⢤⣀⡀⠀⠺⣿⡟⠛⠁",
    "⠀⡠⠋⡤⠠⠋⠀⠀⢀⠐⠁⠀⠈⣙⢯⡃⠀⢈⡻⣦",
    "⢰⣷⠇⠀⠀⠀⢀⡠⠃⠀⠀⠀⠀⠈⠻⢯⡄⠀⢻⣿⣷",
    "⠀⠉⠲⣶⣶⢾⣉⣐⡚⠋⠀⠀⠀⠀⠀⠘⠀⠀⡎⣿⣿⡇",
    "⠀⠀⠀⠀⠀⠀⣸⣿⣿⣿⣷⡄⠀⠀⢠⣿⣴⠀⠀⣿⣿⣿⣧",
    "⠀⠀⠀⢀⣴⣿⣿⣿⣿⣿⠇⠀⢠⠟⣿⠏⢀⣾⠟⢸⣿⡇",
    "⠀⠀⢠⣿⣿⣿⣿⠟⠘⠁⢠⠜⢉⣐⡥⠞⠋⢁⣴⣿⣿⠃",
    "⠀⠀⣾⢻⣿⣿⠃⠀⠀⡀⢀⡄⠁⠀⠀⢠⡾⠁",
    "⠀⠀⠃⢸⣿⡇⠀⢠⣾⡇⢸⡇⠀⠀⠀⡞",
    "⠀⠀⠀⠈⢿⡇⡰⠋⠈⠙⠂⠙⠢",
    "⠀⠀⠀⠀⠈⢧",
  ],
  label: "aditya@arch",
  info: [
    "User        aditya",
    "Distro      Arch Linux x86_64",
    "Kernel      Linux 7.2.6-arch2-1",
    "Uptime      1 hour, 28 mins",
    "WM          niri 26.04 (Wayland)",
    "Terminal    kitty 0.41.1",
    "Shell       zsh + fish",
    "Font        ui-monospace (system mono stack)",
    "Pkgs        120 (aditya-shell)",
  ],
  colors: [
    "#3b4252",
    "#bf616a",
    "#a3be8c",
    "#ebcb8b",
    "#81a1c1",
    "#b48ead",
    "#88c0d0",
    "#e5e9f0",
  ],
} as const;

export const rig = [
  ["OS", "Arch Linux · Void (EclipseLinux)"],
  ["init", "systemd / Dynamod (custom)"],
  ["WM", "niri - scrolling Wayland compositor"],
  ["Shell", "zsh + fish"],
  ["Prompt", "starship-ish, hand-rolled"],
  ["Editor", "Neovim (Lua) + Zed + VS Code"],
  ["Terminal", "kitty"],
  ["Dotfiles", "git-tracked, on GitHub"],
  ["Rice", "minimal, functional, cursed-clean"],
  ["Board", "ESP32 · Arduino · Raspberry Pi"],
  ["Arch", "x86_64"],
] as const;
