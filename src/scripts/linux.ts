/**
 * linux.ts — a pile of static, Linux-flavoured commands for aditya-shell.
 *
 * Nothing here touches the real system. Every "tool" prints a themed,
 * deterministic result so the terminal feels like a workstation while
 * staying a plain static site with a single tiny JS bundle.
 */
import type { CmdOut, Row } from './types';

const HOME = '/home/aditya/dev/portfolio';

const r = (text: string, cls?: string): Row => ({ text, cls });

const vfs: Record<string, string[]> = {
  'about.md': [
    '# aditya verma',
    '',
    'systems & backend developer · electronics engineering student',
    'stack  : C · C++ · Rust · Python',
    'home   : Mumbai, India (UTC+05:30)',
    'motto  : Code. Study. Research. Repeat.',
  ],
  'skills.txt': [
    'systems  : c, c++, rust, shell, linux, networking',
    'embedded : esp32, arduino, raspberry pi, iot, sensors',
    'backend  : python, fastapi, postgres, sqlite, mongodb',
    'data     : numpy, pandas, scikit-learn, opencv, mediapipe',
    'web      : html, css, js, ts, astro (secondary)',
  ],
  'README.md': [
    'this site is a static astro build.',
    'run `neofetch` for the rig, `projects` for work, `man aditya` for the bio.',
    'source is plain html + one small script. no framework. on purpose.',
  ],
};

const lsFiles = [
  'about.md',
  'skills.txt',
  'contact.txt',
  'toolchain/',
  'projects/',
  'notes/',
  'README.md',
];

/* ------------- filesystem / navigation ------------- */

function ls(args: string[]): CmdOut {
  const flags = args.join('');
  if (flags.includes('l')) {
    const rows: CmdOut = [r('total 42', 'dim')];
    rows.push(r('drwxr-xr-x  6 aditya aditya  4.0K Sep 21 16:00 toolchain/', 'ok'));
    rows.push(r('drwxr-xr-x 12 aditya aditya  4.0K Sep 21 16:00 projects/', 'ok'));
    rows.push(r('drwxr-xr-x  5 aditya aditya  4.0K Sep 21 16:00 notes/', 'ok'));
    for (const f of ['about.md', 'skills.txt', 'contact.txt', 'README.md']) {
      rows.push(r(`-rw-r--r--  1 aditya aditya  ${f === 'README.md' ? '900' : '1.2K'} Sep 21 16:00 ${f}`));
    }
    if (flags.includes('a')) rows.push(r('drwxr-xr-x  3 aditya aditya  4.0K Sep 21 16:00 .config/', 'dim'));
    return rows;
  }
  const names = flags.includes('a') ? [...lsFiles, '.zshrc', '.config/', '.git/'] : lsFiles;
  return [
    r(names.join('   '), 'dim'),
    r('hint: `ls -la` for the long form', 'dim'),
  ];
}

function tree(): CmdOut {
  const lines = [
    '.',
    '├── README.md',
    '├── about.md',
    '├── skills.txt',
    '├── contact.txt',
    '├── toolchain/',
    '│   ├── systems/',
    '│   ├── embedded/',
    '│   ├── backend/',
    '│   ├── data/',
    '│   ├── web/            # secondary, by design',
    '│   └── devops/',
    '├── projects/',
    '│   ├── niri-utils.mdx',
    '│   ├── tonarchy.mdx',
    '│   ├── eclipse-linux.mdx',
    '│   ├── eigen-bot.mdx',
    '│   └── ... 6 more',
    '└── notes/',
    '    ├── esp32-registers.mdx',
    '    ├── why-niri.mdx',
    '    ├── dotfiles-infra.mdx',
    '    └── tui-without-curses.mdx',
    '',
  ];
  return [...lines.map((t) => r(t)), r('7 directories, 18 files', 'dim')];
}

function cat(args: string[]): CmdOut {
  const f = args.filter((a) => !a.startsWith('-')).join(' ').replace(/^\.\//, '');
  if (!f) return [r('cat: missing operand — try: cat about.md', 'dim')];
  if (vfs[f]) return [r(`# ${f}`, 'ok'), ...vfs[f].map((t) => r(t))];
  if (f === 'contact.txt') return [r('# contact.txt', 'ok'), ...contactRows()];
  return [r(`cat: ${f}: No such file or directory`, 'err')];
}

function contactRows(): Row[] {
  return [
    r('  github     https://github.com/youngcoder45', 'dim'),
    r('  org        https://github.com/TheCodeVerseHub', 'dim'),
    r('  issues     open a thread, i read everything', 'dim'),
  ];
}

function grep(args: string[]): CmdOut {
  const q = args.filter((a) => !a.startsWith('-'))[0]?.toLowerCase();
  if (!q) return [r('usage: grep <pattern> [file]', 'dim')];
  const hits: Row[] = [];
  for (const [file, lines] of Object.entries(vfs)) {
    for (const line of lines) {
      if (line.toLowerCase().includes(q)) hits.push(r(`${file}: ${line}`, 'ok'));
    }
  }
  return hits.length ? hits : [r(`grep: no matches for '${q}'`, 'dim')];
}

/* ------------- system info ------------- */

function uname(args: string[]): CmdOut {
  if (args.includes('-a')) {
    return [r('Linux arch 6.11.3-zen1-1-zen #1 ZEN SMP PREEMPT_DYNAMIC x86_64 GNU/Linux')];
  }
  return [r('Linux')];
}

function free(): CmdOut {
  return [
    r('               total        used        free      shared  buff/cache   available', 'dim'),
    r('Mem:           15Gi       6.2Gi       1.1Gi       412Mi       8.4Gi       8.6Gi'),
    r('Swap:          15Gi       128Mi        15Gi'),
  ];
}

function ps(): CmdOut {
  return [
    r('USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND', 'dim'),
    r('aditya    1337  6.4  2.1 1024m 128m tty1     Sl   09:12   1:42 nvim'),
    r('aditya    2048  2.1  1.4  512m  88m tty1     S    09:14   0:31 niri'),
    r('aditya    4096  0.8  0.9  256m  54m tty1     S    09:14   0:12 kitty'),
    r('aditya    5120  0.4  0.6  180m  38m tty1     S    09:20   0:06 waybar'),
    r('aditya    8192  0.1  0.2   12m   4m tty1     S    16:42   0:00 cargo build --release', 'dim'),
  ];
}

function top(): CmdOut {
  return [
    r('top - 16:42:07 up 6 days, 14:23,  1 user,  load average: 0.42, 0.38, 0.31', 'dim'),
    r('Tasks: 214 total,   1 running, 213 sleeping,   0 stopped,   0 zombie', 'dim'),
    r('%Cpu(s):  4.2 us,  1.1 sy,  0.0 ni, 94.4 id,  0.3 wa,  0.0 hi,  0.0 si', 'dim'),
    r('MiB Mem :  15872.0 total,   1126.4 free,   6348.8 used,   8396.8 buff/cache', 'dim'),
    '',
    r('  PID USER      PR  NI    VIRT    RES  %CPU  %MEM     TIME+ COMMAND', 'dim'),
    r(' 1337 aditya    20   0 1024.0m 128.0m   6.4   2.1   1:42.11 nvim', 'ok'),
    r(' 2048 aditya    20   0  512.0m  88.0m   2.1   1.4   0:31.04 niri'),
    r(' 8192 aditya    20   0   12.0m   4.0m   0.1   0.2   0:00.02 cargo'),
    '',
    r('press q to quit — but this is static output, so you already did.', 'dim'),
  ];
}

function lscpu(): CmdOut {
  return [
    r('Architecture:            x86_64'),
    r('CPU op-mode(s):          32-bit, 64-bit'),
    r('Model name:              AMD Ryzen 5 5600H with Radeon Graphics'),
    r('CPU(s):                  12'),
    r('Thread(s) per core:      2'),
    r('L3 cache:                16 MiB'),
    r('Virtualization:          AMD-V'),
  ];
}

function lsusb(): CmdOut {
  return [
    r('Bus 001 Device 004: ID 10c4:ea60 Silicon Labs CP210x UART Bridge   # ← ESP32'),
    r('Bus 001 Device 003: ID 2341:0043 Arduino SA Uno R3 (CDC ACM)'),
    r('Bus 001 Device 002: ID 0bda:8153 Realtek USB GbE'),
    r('Bus 002 Device 001: ID 1d6b:0003 Linux Foundation 3.0 root hub'),
  ];
}

function lspci(): CmdOut {
  return [
    r('01:00.0 VGA compatible controller: Advanced Micro Devices [AMD/ATI] Cezanne (amdgpu)'),
    r('02:00.0 Network controller: Intel Corporation Wi-Fi 6 AX200'),
    r('03:00.0 Non-Volatile memory controller: Samsung NVMe SSD Controller'),
  ];
}

function dmesg(): CmdOut {
  return [
    r('[    0.000000] Linux version 6.11.3-zen1-1-zen (gcc 14.2.1)', 'dim'),
    r('[    0.412233] usb 1-2: new full-speed USB device number 4 using xhci_hcd'),
    r('[    0.587101] cp210x 1-2:1.0: cp210x converter detected'),
    r('[    0.591882] usb 1-2: cp210x converter now attached to ttyUSB0'),
    r('[    0.592014] esp32: firmware flash detected on /dev/ttyUSB0', 'ok'),
  ];
}

function journal(): CmdOut {
  return [
    r('-- Journal begins at Fri 2026-09-18 09:12:04 IST. --', 'dim'),
    r('Sep 21 09:12:04 arch systemd[1]: Started aditya.service — Software Engineering.'),
    r('Sep 21 09:12:05 arch kernel: amdgpu: ring gfx initialized'),
    r('Sep 21 16:42:07 arch aditya-shell[8192]: cargo build --release finished in 0.42s', 'ok'),
    r('Sep 21 16:42:07 arch systemd[1]: Reached target Daily Craft.')
  ];
}

function cal(): CmdOut {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  const first = new Date(y, m, 1).getDay();
  const days = new Date(y, m + 1, 0).getDate();
  const title = `${now.toLocaleString('en-US', { month: 'long' })} ${y}`;
  const cells: string[] = [];
  for (let i = 0; i < first; i++) cells.push('  ');
  for (let d = 1; d <= days; d++) cells.push(String(d).padStart(2, ' '));
  const weeks: string[] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7).join(' ').trimEnd());
  }
  return [
    r(title.padStart(Math.floor((20 + title.length) / 2)), 'ok'),
    r('Su Mo Tu We Th Fr Sa', 'dim'),
    ...weeks.map((w) => r(w)),
  ];
}

/* ------------- networking ------------- */

function ping(args: string[]): CmdOut {
  const host = args[0] ?? 'github.com';
  return [
    r(`PING ${host} (140.82.121.4) 56(84) bytes of data.`),
    r('64 bytes from 140.82.121.4: icmp_seq=1 ttl=55 time=22.4 ms'),
    r('64 bytes from 140.82.121.4: icmp_seq=2 ttl=55 time=21.9 ms'),
    r('64 bytes from 140.82.121.4: icmp_seq=3 ttl=55 time=22.1 ms'),
    '',
    r(`--- ${host} ping statistics ---`),
    r('3 packets transmitted, 3 received, 0% packet loss, time 2003ms', 'ok'),
  ];
}

function curl(args: string[]): CmdOut {
  const url = args.find((a) => !a.startsWith('-')) ?? 'aditya-verma.me';
  return [
    r('HTTP/2 200'),
    r('content-type: text/html; charset=utf-8'),
    r('cache-control: public, max-age=0, must-revalidate'),
    r('server: netlify'),
    '',
    r('<!doctype html><html lang="en">…', 'dim'),
    r(`# fetched ${url} — this is a static site, so it was already there.`, 'ok'),
  ];
}

function ipAddr(): CmdOut {
  return [
    r('1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536', 'dim'),
    r('    inet 127.0.0.1/8 scope host lo'),
    r('2: wlan0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500', 'dim'),
    r('    inet 192.168.1.42/24 brd 192.168.1.255 scope global dynamic wlan0', 'ok'),
    r('    link/ether a4:bb:6d:1e:07:c4'),
  ];
}

function ss(): CmdOut {
  return [
    r('Netid State  Recv-Q Send-Q Local Address:Port Peer Address:Port', 'dim'),
    r('tcp   LISTEN 0      128          0.0.0.0:22        0.0.0.0:*'),
    r('tcp   LISTEN 0      511          0.0.0.0:8080      0.0.0.0:*'),
    r('tcp   LISTEN 0      128             [::]:22           [::]:*'),
  ];
}

function nmap(): CmdOut {
  return [
    r('Starting Nmap 7.95 ( https://nmap.org ) at 2026-09-21 16:42 IST', 'dim'),
    r('Nmap scan report for localhost (127.0.0.1)'),
    r('PORT     STATE SERVICE'),
    r('22/tcp   open  ssh'),
    r('8080/tcp open  http-proxy'),
    r('Nmap done: 1 IP address (1 host up) scanned in 0.08 seconds', 'ok'),
  ];
}

/* ------------- dev toolchain ------------- */

function git(args: string[]): CmdOut {
  const sub = args[0];
  const rest = args.slice(1);
  if (sub === 'status') {
    return [
      r('On branch main'),
      r('Your branch is ahead of \'origin/main\' by 3 commits.'),
      r('nothing to commit, working tree clean', 'ok'),
    ];
  }
  if (sub === 'log') {
    return [
      r('f3a9c21 feat(shell): add 55 linux commands', 'ok'),
      r('b81d440 style: engineering-grid background'),
      r('9c07e12 feat(content): esp32 registers note'),
      r('4d2ab90 chore: drop unused clock script'),
      r('1e8f003 init: astro + vanilla ts portfolio', 'dim'),
    ];
  }
  if (sub === 'remote') {
    return [
      r('origin  https://github.com/youngcoder45/portfolio.git (fetch)', 'dim'),
      r('origin  https://github.com/youngcoder45/portfolio.git (push)', 'dim'),
    ];
  }
  if (sub === 'clone') {
    const url = rest[0] ?? 'https://github.com/youngcoder45/niri-utils';
    return [
      r(`Cloning into '${url.split('/').pop()?.replace('.git', '')}'...`),
      r('remote: Enumerating objects: 1247, done.'),
      r('Receiving objects: 100% (1247/1247), 412.6 KiB | 3.1 MiB/s, done.', 'ok'),
      r('Resolving deltas: 100% (612/612), done.'),
    ];
  }
  return [
    r('usage: git <status|log|remote -v|clone <url>>', 'dim'),
    r('yes, this is a real repo. no, this terminal is not really cloning it.', 'dim'),
  ];
}

function compile(tool: string): CmdOut {
  return [
    r(`[1/3] compiling ${tool} sources...`, 'dim'),
    r('[2/3] linking objects...', 'dim'),
    r('[3/3] stripping symbols...', 'dim'),
    r(`    Finished release [optimized] target(s) in 0.42s`, 'ok'),
    r('binary written to ./target/release/aditya', 'ok'),
  ];
}

function python(): CmdOut {
  return [
    r('Python 3.13.1 (main, Dec  4 2025, 09:12:04) [GCC 14.2.1] on linux', 'dim'),
    r('Type "help", "copyright", "credits" or "license" for more information.'),
    r('>>> import this'),
    r('The Zen of Python, by Tim Peters'),
    r('Beautiful is better than ugly.'),
    r('Explicit is better than implicit.'),
    r('Simple is better than complex.', 'ok'),
  ];
}

/* ------------- fun / hidden ------------- */

function cmatrix(): CmdOut {
  const glyphs = 'アイウエオカキクケコサシスセソ01';
  const rows: Row[] = [];
  for (let i = 0; i < 8; i++) {
    let line = '';
    for (let j = 0; j < 42; j++) line += Math.random() > 0.5 ? glyphs[Math.floor(Math.random() * glyphs.length)] : ' ';
    rows.push(r(line, i % 3 === 0 ? 'ok' : 'dim'));
  }
  return rows;
}

const FORTUNES = [
  'You will ship a kernel module and forget to sleep. Again.',
  'The bug is in the code you did not write.',
  'A watched build never finishes.',
  '99 little bugs in the code, take one down, patch it around...',
  'There are two hard problems: cache invalidation, naming, and off-by-one.',
];

function fortune(): CmdOut {
  return [r(FORTUNES[Math.floor(Math.random() * FORTUNES.length)], 'ok')];
}

function cowsay(args: string[]): CmdOut {
  const msg = args.join(' ') || 'hello from /dev/tty0';
  return [
    r(' ' + '_'.repeat(msg.length + 2)),
    r('< ' + msg + ' >'),
    r(' ' + '-'.repeat(msg.length + 2)),
    r('        \\   ^__^'),
    r('         \\  (oo)\\_______'),
    r('            (__)\\       )\\/\\'),
    r('                ||----w |'),
    r('                ||     ||'),
  ];
}

function banner(args: string[]): CmdOut {
  const text = (args.join(' ') || 'ADITYA').toUpperCase();
  const rows = ['#' + '#'.repeat(text.length + 2) + '#'];
  rows.push('#' + ' ' + text + ' ' + '#');
  rows.push('#' + '#'.repeat(text.length + 2) + '#');
  return rows.map((t) => r(t, 'ok'));
}

function sl(): CmdOut {
  return [
    r('      ====        ________                ___________', 'ok'),
    r('  _D _|  |_______/        \\__I_I_____===__|_________|', 'ok'),
    r('   |(_)---  |   H\\________/ |   |        =|___ ___|  ', 'ok'),
    r('   /     |  |   H  |  |     |   |         ||_| |_||  ', 'ok'),
    r('  |      |  |   H  |__--------------------| [___] |  ', 'ok'),
    r('  | ________|___H__/__|_____/[][]~\\_______|       |  ', 'ok'),
    r('  |/ |   |-----------I_____I [][] []  D   |=======|__', 'ok'),
    r('__/ =| o |=-~~\\  /~~\\  /~~\\  /~~\\ ____Y___________|__', 'dim'),
    r(' |/-=|___|=    ||    ||    ||    |_____/~\\___/        ', 'dim'),
    r('  \\_/      \\O=====O=====O=====O_/      \\_/            ', 'dim'),
    r('you typed `ls` wrong. classic. the train does not stop.', 'dim'),
  ];
}

/* ------------- man pages ------------- */

const MAN: Record<string, string[]> = {
  aditya: [
    'ADITYA(1)  User Commands  ADITYA(1)',
    '',
    'NAME',
    '  aditya - systems & backend developer, electronics student',
    '',
    'DESCRIPTION',
    '  Writes C, C++, Rust and Python. Lives in the terminal.',
    '  Prefers low-level, embedded and backend problems. Ships.',
    '',
    'SEE ALSO',
    '  neofetch(1), git(1), cargo(1), esp32(7)',
  ],
  niri: [
    'NIRI(1)                      User Commands                      NIRI(1)',
    '',
    'NAME',
    '       niri - a scrollable-tiling Wayland compositor',
    '',
    'DESCRIPTION',
    '       Aditya rices niri, maintains niri-utils, and wrote a note',
    '       explaining why columns beat workspaces. Run: cheat niri',
    '',
  ],
  shell: [
    'SHELL(1)                     User Commands                     SHELL(1)',
    '',
    'NAME',
    '       aditya-shell - this terminal',
    '',
    'DESCRIPTION',
    '       Static, dependency-free, ~12KB of JS. Type `help` for commands.',
    '',
  ],
  git: [
    'GIT(1)                       Git Manual                       GIT(1)',
    '',
    'NAME',
    '       git - the stupid content tracker',
    '',
  ],
  cargo: [
    'CARGO(1)                     User Commands                     CARGO(1)',
    '',
    'NAME',
    '       cargo - the Rust package manager',
    '',
  ],
  esp32: [
    'ESP32(7)                 Miscellaneous Information Manual         ESP32(7)',
    '',
    'NAME',
    '       esp32 - dual-core Xtensa/RISC-V MCU with Wi-Fi + BLE',
    '',
    'NOTES',
    '       Flashed from Linux via /dev/ttyUSB0 (CP210x). See notes/.',
    '',
  ],
};

function man(args: string[]): CmdOut {
  const topic = args[0]?.toLowerCase();
  if (!topic) return [r('What manual page do you want?  try: man aditya', 'dim')];
  if (MAN[topic]) return MAN[topic].map((t) => r(t));
  return [r(`No manual entry for ${topic}`, 'err')];
}

/* ------------- process / package ------------- */

function systemctl(args: string[]): CmdOut {
  const verb = args[0] ?? 'status';
  if (verb === 'status') {
    return [
      r('● aditya.service - Software Engineering, FOSS & Embedded', 'ok'),
      r('     Loaded: loaded (/etc/systemd/system/aditya.service; enabled)'),
      r('     Active: active (running) since Fri 2026-09-18 09:12:04 IST; 3 days ago'),
      r('   Main PID: 1000 (aditya)'),
      r('      Tasks: many'),
      r('     CGroup: /user.slice/aditya.slice'),
    ];
  }
  return [r(`systemctl: ${verb} aditya.service — it never really stops`, 'dim')];
}

function pacman(args: string[]): CmdOut {
  if (args.includes('-Syu')) {
    return [
      r(':: Synchronizing package databases...', 'dim'),
      r(' core is up to date'),
      r(' extra is up to date'),
      r(':: Starting full system upgrade...', 'dim'),
      r(' there is nothing to do', 'ok'),
      r('(btw, this is an Arch joke. the site is static.)', 'dim'),
    ];
  }
  const pkg = args.filter((a) => !a.startsWith('-')).join(' ') || 'aditya';
  return [r(`resolving dependencies...`, 'dim'), r(`installing ${pkg}... 100%`, 'ok')];
}

/* ------------- router ------------- */

export function runLinux(cmd: string, args: string[], history: string[]): CmdOut | null {
  switch (cmd) {
    /* filesystem */
    case 'ls':
    case 'dir':
      return ls(args);
    case 'll':
    case 'la':
      return ls(['-la']);
    case 'pwd':
      return [r(HOME)];
    case 'cd':
      return [r(`cd: ${args[0] ?? '~'}: this terminal renders output only — it does not navigate.`, 'err'), r('try `tree`, `ls`, or `cat about.md`.', 'dim')];
    case 'tree':
      return tree();
    case 'cat':
      return cat(args);
    case 'stat':
      return [
        r(`  File: ${args[0] ?? 'about.md'}`),
        r('  Size: 1234       Blocks: 8          IO Block: 4096   regular file'),
        r('Device: 8,2        Inode: 262144      Links: 1'),
        r('Access: (0644/-rw-r--r--)  Uid: (1000/aditya)   Gid: (1000/aditya)'),
        r('Modify: 2026-09-21 16:00:00 +05:30', 'dim'),
      ];
    case 'find':
      return args.join(' ').includes('*.mdx')
        ? ['./projects/niri-utils.mdx', './projects/tonarchy.mdx', './projects/eclipse-linux.mdx', './projects/eigen-bot.mdx', './notes/esp32-registers.mdx', './notes/why-niri.mdx'].map((t) => r(t))
        : ['./about.md', './skills.txt', './contact.txt', './README.md'].map((t) => r(t));
    case 'du':
      return [r('4.0K    ./toolchain'), r('28K     ./projects'), r('16K     ./notes'), r('260K    .')];
    case 'df':
      return [
        r('Filesystem      Size  Used Avail Use% Mounted on', 'dim'),
        r('/dev/nvme0n1p2  476G  312G  140G  70% /'),
        r('/dev/nvme0n1p1  511M   64M  448M  13% /boot'),
        r('/dev/nvme0n1p3  931G  620G  311G  67% /home'),
      ];
    case 'mkdir':
      return [r(`mkdir: created directory '${args[0] ?? 'newdir'}' (in your imagination)`, 'ok')];
    case 'touch':
      return [r(`touch: '${args[0] ?? 'newfile'}' — 0 bytes of pure potential`, 'ok')];
    case 'rm':
      return /-rf?\s*\/\s*$/.test(args.join(' ')) || args.join(' ').includes('/*')
        ? [r('rm: refusing to shred the filesystem. i live here.', 'err')]
        : [r(`rm: '${args.filter((a) => !a.startsWith('-')).join(' ') || 'nothing'}': removed`, 'ok')];
    case 'chmod':
      return [r(`chmod: ${args.join(' ') || 'mode unchanged'} — permissions are a state of mind`, 'ok')];
    case 'grep':
      return grep(args);
    case 'which':
      return args[0] ? [r(`/usr/bin/${args[0]}`)] : [r('which: missing argument', 'err')];
    case 'head':
      return vfs['about.md'].slice(0, 3).map((t) => r(t));
    case 'wc':
      return [r('  6  24 178 about.md', 'dim')];

    /* system info */
    case 'uname':
      return uname(args);
    case 'hostname':
      return [r('arch')];
    case 'id':
      return [r('uid=1000(aditya) gid=1000(aditya) groups=1000(aditya),998(wheel),1002(docker),1003(video)')];
    case 'groups':
      return [r('aditya wheel docker video')];
    case 'uptime':
      return [r(' 16:42:07 up 6 days, 14:23,  1 user,  load average: 0.42, 0.38, 0.31')];
    case 'free':
      return free();
    case 'ps':
      return ps();
    case 'top':
    case 'htop':
    case 'btop':
      return top();
    case 'lscpu':
      return lscpu();
    case 'lsusb':
      return lsusb();
    case 'lspci':
      return lspci();
    case 'dmesg':
      return dmesg();
    case 'journalctl':
      return journal();
    case 'who':
      return [r('aditya   tty1         2026-09-21 09:12 (:0)')];
    case 'last':
      return [r('aditya   tty1         still logged in', 'dim')];
    case 'cal':
      return cal();
    case 'timedatectl':
      return [r('               Local time: Sun 2026-09-21 16:42:07 IST'), r('       Universal time: Sun 2026-09-21 11:12:07 UTC'), r('             Time zone: Asia/Kolkata (IST, +0530)'), r('           NTP service: active', 'ok')];
    case 'printenv':
      return [r('SHELL=/bin/zsh'), r('EDITOR=nvim'), r('TERM=kitty'), r('LANG=en_IN.UTF-8'), r('USER=aditya'), r('HOME=/home/aditya')];

    /* networking */
    case 'ping':
      return ping(args);
    case 'curl':
    case 'wget':
      return curl(args);
    case 'ip':
      return ipAddr();
    case 'ifconfig':
      return [r('wlan0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500'), r('        inet 192.168.1.42  netmask 255.255.255.0  broadcast 192.168.1.255', 'ok'), r('        ether a4:bb:6d:1e:07:c4  txqueuelen 1000  (Ethernet)')];
    case 'ss':
    case 'netstat':
      return ss();
    case 'nmap':
      return nmap();
    case 'dig':
      return [r(`; <<>> DiG 9.20 <<>> ${args[0] ?? 'github.com'}`), r(';; ANSWER SECTION:'), r('github.com.  60  IN  A  140.82.121.4', 'ok')];

    /* process / package */
    case 'systemctl':
      return systemctl(args);
    case 'pacman':
    case 'yay':
    case 'apt':
      return pacman(args);
    case 'kill':
      return [r(`kill: (${args[0] ?? '?'}) - Operation permitted. go in peace.`, 'dim')];

    /* dev toolchain */
    case 'git':
      return git(args);
    case 'make':
      return [r('make: Nothing to be done for \'all\'.', 'dim'), r('(already built. like this website.)', 'dim')];
    case 'gcc':
    case 'clang':
    case 'cc':
      return compile(cmd);
    case 'rustc':
      return [r('rustc 1.83.0 (90b35a623 2024-11-26)')];
    case 'cargo':
      return args.includes('build') || args.includes('run')
        ? compile('cargo')
        : [r('cargo 1.83.0 — usage: cargo build | cargo run | cargo test')];
    case 'python':
    case 'python3':
    case 'py':
      return python();
    case 'pip':
    case 'pip3':
      return [r('Requirement already satisfied: everything (0.0.0)')];
    case 'node':
    case 'npm':
      return [r('v26.8.2')];
    case 'nvim':
    case 'vim':
      return [r('Why would you exit vim? :q  (jk — stay a while)', 'err')];
    case 'nano':
      return [r('GNU nano 8.2 — ^O to write out, ^X to exit. (you probably wanted nvim.)', 'dim')];
    case 'tmux':
      return [r('[aditya-shell] 0:code* 1:notes- 2:build-', 'ok'), r('detached (from session aditya-shell)', 'dim')];
    case 'code':
      return [r('code: command not found — this machine lives in the terminal.', 'err'), r('try `nvim .`', 'dim')];
    case 'docker':
      return [r('CONTAINER ID   IMAGE       STATUS         NAMES'), r('a1b2c3d4e5f6   archlinux   Up 6 days      dev'), r('f6e5d4c3b2a1   postgres    Up 6 days      db', 'ok')];
    case 'alias':
      return [r("alias ll='ls -la'"), r("alias gs='git status'"), r("alias cb='cargo build --release'")];
    case 'export':
      return [r(`export: ${args.join(' ')} — noted, but this shell forgets on reload`, 'dim')];
    case 'history':
      return history.length
        ? history.map((h, i) => r(`${String(i + 1).padStart(4, ' ')}  ${h}`))
        : [r('history: no commands yet', 'dim')];
    case 'man':
      return man(args);

    /* fun / hidden */
    case 'cmatrix':
      return cmatrix();
    case 'fortune':
      return fortune();
    case 'cowsay':
      return cowsay(args);
    case 'banner':
      return banner(args);
    case 'sl':
      return sl();
    case 'exit':
    case 'logout':
    case 'quit':
      return [r('there is no escape. only more commands.', 'err'), r('try `git clone` or `man aditya` instead.', 'dim')];
    case 'reboot':
    case 'shutdown':
    case 'poweroff':
      return [r(`${cmd}: interactive confirmation required. denied.`, 'err'), r('uptime is 6 days — respect the streak.', 'dim')];
    case 'mkfs':
      return [r('mkfs: are you sure? (y/N)  ... no. definitely no.', 'err')];
    case 'dd':
      return [r('dd: writing to /dev/dreams... 4096 bytes copied (this was a bad idea)', 'dim')];
    case 'chicken':
      return [r('      __', 'ok'), r('  ___/  \\', 'ok'), r(' (o   o)  cluck. you found the easter egg.', 'ok'), r('  \\___/', 'dim')];
    default:
      return null;
  }
}

export function linuxHelp(): CmdOut {
  return [
    r('  ── linux toolbox ──────────────────────────────', 'lbl'),
    r('  ls  ll  pwd  cd  tree  cat  stat  find  du', 'dim'),
    r('  df  grep  head  wc  mkdir  touch  rm  chmod  which', 'dim'),
    r('  uname  hostname  id  groups  uptime  free  ps', 'dim'),
    r('  top  htop  lscpu  lsusb  lspci  dmesg  journalctl', 'dim'),
    r('  who  last  cal  timedatectl  printenv', 'dim'),
    r('  ping  curl  wget  ip  ifconfig  ss  netstat  nmap  dig', 'dim'),
    r('  systemctl  pacman  yay  apt  kill', 'dim'),
    r('  git  make  gcc  clang  rustc  cargo  python3  pip  npm', 'dim'),
    r('  nvim  nano  tmux  docker  alias  export  history  man', 'dim'),
    r('  ── hidden: cmatrix  fortune  cowsay  banner  sl  chicken', 'lbl'),
  ];
}
