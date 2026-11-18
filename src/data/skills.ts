export type SkillEvidence = {
  title: string;
  path: string;
  kind: 'project' | 'note';
  note?: string;
};

export type Skill = {
  name: string;
  spec: string;
  level: number; // 1-5
  evidence?: SkillEvidence[];
};

export type SkillGroup = {
  id: string;
  title: string;
  blurb: string;
  path: string;
  skills: Skill[];
};

export const skillGroups: SkillGroup[] = [
  {
    id: 'systems',
    title: 'Systems & Low-Level',
    blurb: 'Where the machine actually runs. Memory, registers, and zero abstractions on top.',
    path: '~/usr/local/lib/aditya/systems',
    skills: [
      {
        name: 'C',
        spec: 'embedded · POSIX · libc',
        level: 4,
        evidence: [
          { title: 'tui-without-curses', path: '/notes/tui-without-curses', kind: 'note', note: 'terminal emulator in raw C & POSIX ioctls' },
          { title: 'esp32-registers', path: '/notes/esp32-registers', kind: 'note', note: 'bare-metal register mapping & bit manipulation' },
        ],
      },
      {
        name: 'C++',
        spec: 'systems · tooling',
        level: 3,
        evidence: [
          { title: 'esp32-registers', path: '/notes/esp32-registers', kind: 'note', note: 'embedded hardware register control' },
        ],
      },
      {
        name: 'Rust',
        spec: 'safe systems · CLI',
        level: 4,
        evidence: [
          { title: 'niri-utils', path: '/projects/niri-utils', kind: 'project', note: 'IPC window helper layer for Niri Wayland compositor' },
        ],
      },
      {
        name: 'Shell / POSIX',
        spec: 'bash · awk · scripts',
        level: 4,
        evidence: [
          { title: 'EclipseLinux', path: '/projects/eclipse-linux', kind: 'project', note: 'Dynamod custom init system & boot scripts' },
          { title: 'dotfiles-infra', path: '/notes/dotfiles-infra', kind: 'note', note: 'declarative GNU Stow dotfiles framework' },
        ],
      },
      {
        name: 'Linux',
        spec: 'Arch · Void · init · Wayland',
        level: 4,
        evidence: [
          { title: 'EclipseLinux', path: '/projects/eclipse-linux', kind: 'project', note: 'Void-based distribution with custom init' },
          { title: 'why-niri', path: '/notes/why-niri', kind: 'note', note: 'Wayland scrolling compositor deep dive' },
        ],
      },
      {
        name: 'Networking',
        spec: 'sockets · protocols · matrices',
        level: 3,
        evidence: [
          { title: 'discord-matrix-bridge', path: '/projects/discord-matrix-bridge', kind: 'project', note: 'Matrix federation protocol & WebSockets' },
        ],
      },
    ],
  },
  {
    id: 'embedded',
    title: 'Embedded & Hardware',
    blurb: 'Software that touches copper. Sensors, actuators, and firmware on real silicon.',
    path: '~/dev/boards/{esp32,arduino,rpi}',
    skills: [
      {
        name: 'ESP32',
        spec: 'esp-idf · wifi · mqtt',
        level: 3,
        evidence: [
          { title: 'esp32-registers', path: '/notes/esp32-registers', kind: 'note', note: 'GPIO registers & hardware timer interrupts' },
        ],
      },
      {
        name: 'Arduino',
        spec: 'AVR · io · serial',
        level: 4,
        evidence: [
          { title: 'esp32-registers', path: '/notes/esp32-registers', kind: 'note', note: 'microcontroller register-level programming' },
        ],
      },
      { name: 'Raspberry Pi', spec: 'gpio · linux on metal', level: 3 },
      {
        name: 'Embedded C',
        spec: 'registers · interrupts',
        level: 3,
        evidence: [
          { title: 'esp32-registers', path: '/notes/esp32-registers', kind: 'note', note: 'direct peripheral control without HAL' },
        ],
      },
      {
        name: 'IoT',
        spec: 'sensors · telemetry · control',
        level: 3,
        evidence: [
          { title: 'OpenCV-Math-Solver', path: '/projects/opencv-math-solver', kind: 'project', note: 'camera sensor stream & interactive feed' },
        ],
      },
    ],
  },
  {
    id: 'backend',
    title: 'Backend & Services',
    blurb: 'Servers, bots, APIs and databases that stay up past midnight.',
    path: '~/var/lib/aditya/backend',
    skills: [
      {
        name: 'Python',
        spec: 'async · discord.py · fastapi',
        level: 5,
        evidence: [
          { title: 'Eigen-Bot', path: '/projects/eigen-bot', kind: 'project', note: 'async community bot with dynamic plugin system' },
          { title: 'Discord-Server-Exporter-Bot', path: '/projects/discord-server-exporter-bot', kind: 'project', note: 'async chat archiver & export pipelines' },
        ],
      },
      { name: 'FastAPI', spec: 'REST · websockets', level: 4 },
      { name: 'PostgreSQL', spec: 'SQL · models', level: 3 },
      {
        name: 'SQLite',
        spec: 'embedded datastore',
        level: 4,
        evidence: [
          { title: 'Eigen-Bot', path: '/projects/eigen-bot', kind: 'project', note: 'server configuration & state persistence' },
        ],
      },
      { name: 'MongoDB', spec: 'document store', level: 3 },
      {
        name: 'Node',
        spec: 'typescript · http',
        level: 3,
        evidence: [
          { title: 'discord-matrix-bridge', path: '/projects/discord-matrix-bridge', kind: 'project', note: 'event-driven bridge server' },
        ],
      },
    ],
  },
  {
    id: 'data',
    title: 'Data & ML',
    blurb: 'Turning datasets into decisions and hobby projects into demos.',
    path: '~/datasets/aditya/{train,test,valid}',
    skills: [
      {
        name: 'NumPy / Pandas',
        spec: 'processing',
        level: 4,
        evidence: [
          { title: 'Student-Performance-Predictor', path: '/projects/student-performance-predictor', kind: 'project', note: 'feature engineering & tabular data cleansing' },
        ],
      },
      {
        name: 'scikit-learn',
        spec: 'models · pipelines',
        level: 3,
        evidence: [
          { title: 'Student-Performance-Predictor', path: '/projects/student-performance-predictor', kind: 'project', note: 'regression pipelines & model evaluation' },
        ],
      },
      {
        name: 'OpenCV / MediaPipe',
        spec: 'vision · gestures',
        level: 3,
        evidence: [
          { title: 'OpenCV-Math-Solver', path: '/projects/opencv-math-solver', kind: 'project', note: 'real-time hand gesture tracking & OCR' },
        ],
      },
      {
        name: 'Matplotlib',
        spec: 'plots',
        level: 3,
        evidence: [
          { title: 'Student-Performance-Predictor', path: '/projects/student-performance-predictor', kind: 'project', note: 'accuracy curves & residual distributions' },
        ],
      },
      { name: 'Jupyter', spec: 'notebooks', level: 3 },
    ],
  },
  {
    id: 'web',
    title: 'Web (secondary)',
    blurb: 'Part of the toolkit, not the identity. Ships when needed.',
    path: '~/www/aditya/{html,css,js,web3}',
    skills: [
      {
        name: 'HTML / CSS',
        spec: 'semantic · vanilla',
        level: 4,
        evidence: [
          { title: 'Personal-Portfolio', path: '/projects/personal-portfolio', kind: 'project', note: '14-theme design system in vanilla CSS' },
        ],
      },
      {
        name: 'JavaScript / TS',
        spec: 'vanilla · node',
        level: 4,
        evidence: [
          { title: 'discord-matrix-bridge', path: '/projects/discord-matrix-bridge', kind: 'project', note: 'strict TypeScript matrix client logic' },
        ],
      },
      {
        name: 'Astro',
        spec: 'this site',
        level: 4,
        evidence: [
          { title: 'Personal-Portfolio', path: '/projects/personal-portfolio', kind: 'project', note: 'Astro 5 static output with zero client JS runtime' },
        ],
      },
      {
        name: 'React / Next',
        spec: 'when asked nicely',
        level: 3,
        evidence: [
          { title: 'CodeVerseHub-Website', path: '/projects/codeversehub-website', kind: 'project', note: 'Next.js platform for developer community' },
        ],
      },
      { name: 'Web3', spec: 'wallets · dapps · solidity', level: 2 },
    ],
  },
  {
    id: 'devops',
    title: 'DevOps & Infra',
    blurb: 'Shipping, running, and keeping things alive in production.',
    path: '~/etc/aditya/{ci,containers,monitoring}',
    skills: [
      { name: 'Docker', spec: 'compose · build · registry', level: 3 },
      {
        name: 'CI/CD',
        spec: 'github actions · pipelines',
        level: 3,
        evidence: [
          { title: 'Personal-Portfolio', path: '/projects/personal-portfolio', kind: 'project', note: 'link integrity & static validation workflow' },
        ],
      },
      {
        name: 'Linux Servers',
        spec: 'systemd · nginx · hardening',
        level: 3,
        evidence: [
          { title: 'EclipseLinux', path: '/projects/eclipse-linux', kind: 'project', note: 'system bootstrap & service supervisor configuration' },
        ],
      },
      { name: 'Networking (ops)', spec: 'dns · tls · reverse proxy', level: 3 },
      { name: 'Monitoring', spec: 'logs · metrics · alerts', level: 2 },
    ],
  },
] as const;

export const stackLabels: Record<string, string> = {
  systems: 'systems',
  linux: 'linux',
  embedded: 'embedded',
  backend: 'backend',
  data: 'data',
  devtools: 'devtools',
  devops: 'devops',
  web: 'web',
  foss: 'foss',
} as const;

const LEVEL_TAGS: Record<number, string> = {
  5: 'expert',
  4: 'strong',
  3: 'working',
  2: 'learning',
  1: 'curious',
};

export const levelTag = (level: number): string => LEVEL_TAGS[level] ?? 'unknown';

export const totalSkillsCount = skillGroups.reduce((acc, g) => acc + g.skills.length, 0);
export const totalEvidenceCount = skillGroups.reduce(
  (acc, g) => acc + g.skills.reduce((sAcc, s) => sAcc + (s.evidence?.length ?? 0), 0),
  0,
);
