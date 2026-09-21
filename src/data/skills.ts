export type Skill = {
  name: string;
  spec: string;
  level: number; // 1-5
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
      { name: 'C', spec: 'embedded · POSIX · libc', level: 4 },
      { name: 'C++', spec: 'systems · tooling', level: 3 },
      { name: 'Rust', spec: 'safe systems · CLI', level: 4 },
      { name: 'Shell / POSIX', spec: 'bash · awk · scripts', level: 4 },
      { name: 'Linux', spec: 'Arch · Void · init · Wayland', level: 4 },
      { name: 'Networking', spec: 'sockets · protocols · matrices', level: 3 },
    ],
  },
  {
    id: 'embedded',
    title: 'Embedded & Hardware',
    blurb: 'Software that touches copper. Sensors, actuators, and firmware on real silicon.',
    path: '~/dev/boards/{esp32,arduino,rpi}',
    skills: [
      { name: 'ESP32', spec: 'esp-idf · wifi · mqtt', level: 3 },
      { name: 'Arduino', spec: 'AVR · io · serial', level: 4 },
      { name: 'Raspberry Pi', spec: 'gpio · linux on metal', level: 3 },
      { name: 'Embedded C', spec: 'registers · interrupts', level: 3 },
      { name: 'IoT', spec: 'sensors · telemetry · control', level: 3 },
    ],
  },
  {
    id: 'backend',
    title: 'Backend & Services',
    blurb: 'Servers, bots, APIs and databases that stay up past midnight.',
    path: '~/var/lib/aditya/backend',
    skills: [
      { name: 'Python', spec: 'async · discord.py · fastapi', level: 5 },
      { name: 'FastAPI', spec: 'REST · websockets', level: 4 },
      { name: 'PostgreSQL', spec: 'SQL · models', level: 3 },
      { name: 'SQLite', spec: 'embedded datastore', level: 4 },
      { name: 'MongoDB', spec: 'document store', level: 3 },
      { name: 'Node', spec: 'typescript · http', level: 3 },
    ],
  },
  {
    id: 'data',
    title: 'Data & ML',
    blurb: 'Turning datasets into decisions and hobby projects into demos.',
    path: '~/datasets/aditya/{train,test,valid}',
    skills: [
      { name: 'NumPy / Pandas', spec: 'processing', level: 4 },
      { name: 'scikit-learn', spec: 'models · pipelines', level: 3 },
      { name: 'OpenCV / MediaPipe', spec: 'vision · gestures', level: 3 },
      { name: 'Matplotlib', spec: 'plots', level: 3 },
      { name: 'Jupyter', spec: 'notebooks', level: 3 },
    ],
  },
  {
    id: 'web',
    title: 'Web (secondary)',
    blurb: 'Part of the toolkit, not the identity. Ships when needed.',
    path: '~/www/aditya/{html,css,js,web3}',
    skills: [
      { name: 'HTML / CSS', spec: 'semantic · vanilla', level: 4 },
      { name: 'JavaScript / TS', spec: 'vanilla · node', level: 4 },
      { name: 'Astro', spec: 'this site', level: 4 },
      { name: 'React / Next', spec: 'when asked nicely', level: 3 },
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
      { name: 'CI/CD', spec: 'github actions · pipelines', level: 3 },
      { name: 'Linux Servers', spec: 'systemd · nginx · hardening', level: 3 },
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