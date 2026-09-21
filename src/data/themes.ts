export type Theme = {
  id: string;
  name: string;
  mode: 'light' | 'dark';
  swatch: string[]; // [bg, fg, accent, border]
};

export const themes: Theme[] = [
  { id: 'paper', name: 'Day', mode: 'light', swatch: ['#f4f1ea', '#17191c', '#237a48', '#cfc7b2'] },
  { id: 'dark', name: 'Night', mode: 'dark', swatch: ['#0b0f14', '#e7edf3', '#4ade80', '#1d2834'] },
  { id: 'nord', name: 'Nord', mode: 'light', swatch: ['#e5e9f0', '#2e3440', '#5e81ac', '#c4ccd8'] },
  { id: 'dracula', name: 'Dracula', mode: 'dark', swatch: ['#282a36', '#f8f8f2', '#bd93f9', '#414458'] },
  { id: 'lofi', name: 'Lofi', mode: 'light', swatch: ['#f5f5f0', '#1a1a1a', '#6b7280', '#d0d0c6'] },
  { id: 'sunset', name: 'Sunset', mode: 'light', swatch: ['#fde8d0', '#2d1b0e', '#c2410c', '#e8c297'] },
  { id: 'dim', name: 'Dim', mode: 'dark', swatch: ['#1a1d23', '#e2e8f0', '#6faf83', '#30353f'] },
  { id: 'synthwave', name: 'Synthwave', mode: 'dark', swatch: ['#1a1035', '#e0cffc', '#f472b6', '#3a2766'] },
  { id: 'forest', name: 'Forest', mode: 'dark', swatch: ['#171d1b', '#e3ece7', '#6b8f71', '#2f3b36'] },
  { id: 'abyss', name: 'Abyss', mode: 'dark', swatch: ['#0d1117', '#dae2ea', '#58a6ff', '#21262d'] },
  { id: 'retro', name: 'Retro', mode: 'light', swatch: ['#f0e6d3', '#2d1b0e', '#6b4c2a', '#d4c5a9'] },
  { id: 'cyberpunk', name: 'Cyberpunk', mode: 'dark', swatch: ['#0d0d0d', '#f5e942', '#2dd4bf', '#2a2a2a'] },
  { id: 'halloween', name: 'Halloween', mode: 'dark', swatch: ['#1a1a1a', '#fed7aa', '#ea580c', '#333333'] },
  { id: 'autumn', name: 'Autumn', mode: 'light', swatch: ['#fdf6f0', '#2d1b0e', '#c2410c', '#e6d2bb'] },
  { id: 'coffee', name: 'Coffee', mode: 'dark', swatch: ['#20161f', '#e6d5c3', '#a68b6b', '#3a2c37'] },
  { id: 'garden', name: 'Garden', mode: 'light', swatch: ['#f0f7f0', '#1a2e1a', '#4a7c4a', '#cfdfcf'] },
  { id: 'business', name: 'Business', mode: 'dark', swatch: ['#0f172a', '#e2e8f0', '#60a5fa', '#263149'] },
  { id: 'winter', name: 'Winter', mode: 'light', swatch: ['#f0f4f8', '#1a202c', '#3f6fa8', '#cdd9e3'] },
] as const;