import type { BreakTemplate } from './types'

export const DEFAULT_TEMPLATE_ID = 'prizm-hobby-24'

export const BREAK_TEMPLATES: BreakTemplate[] = [
  {
    id: 'prizm-hobby-24',
    name: '2024 Prizm Hobby — NBA',
    teams: [
      { id: 'lak', name: 'Lakers', weight: 10 },
      { id: 'gsw', name: 'Warriors', weight: 9 },
      { id: 'bos', name: 'Celtics', weight: 9 },
      { id: 'dal', name: 'Mavericks', weight: 8 },
      { id: 'den', name: 'Nuggets', weight: 8 },
      { id: 'mia', name: 'Heat', weight: 7 },
      { id: 'phi', name: 'Sixers', weight: 7 },
      { id: 'chi', name: 'Bulls', weight: 6 },
      { id: 'nyc', name: 'Knicks', weight: 6 },
      { id: 'por', name: 'Trail Blazers', weight: 4 },
      { id: 'det', name: 'Pistons', weight: 3 },
      { id: 'cha', name: 'Hornets', weight: 3 },
    ],
  },
  {
    id: 'select-hobby-24',
    name: '2024 Select Hobby — NFL',
    teams: [
      { id: 'kc', name: 'Chiefs', weight: 10 },
      { id: 'sf', name: '49ers', weight: 9 },
      { id: 'buf', name: 'Bills', weight: 8 },
      { id: 'phi-nfl', name: 'Eagles', weight: 8 },
      { id: 'dal-nfl', name: 'Cowboys', weight: 7 },
      { id: 'bal', name: 'Ravens', weight: 7 },
      { id: 'mia-nfl', name: 'Dolphins', weight: 6 },
      { id: 'cin', name: 'Bengals', weight: 6 },
      { id: 'nyg', name: 'Giants', weight: 5 },
      { id: 'sea', name: 'Seahawks', weight: 5 },
      { id: 'lar', name: 'Rams', weight: 4 },
      { id: 'jax', name: 'Jaguars', weight: 3 },
    ],
  },
  {
    id: 'topps-chrome-24',
    name: '2024 Topps Chrome — MLB',
    teams: [
      { id: 'nyy', name: 'Yankees', weight: 10 },
      { id: 'lad', name: 'Dodgers', weight: 10 },
      { id: 'atl', name: 'Braves', weight: 8 },
      { id: 'hou', name: 'Astros', weight: 8 },
      { id: 'phi-mlb', name: 'Phillies', weight: 7 },
      { id: 'sd', name: 'Padres', weight: 6 },
      { id: 'tb', name: 'Rays', weight: 5 },
      { id: 'tor', name: 'Blue Jays', weight: 5 },
      { id: 'tex', name: 'Rangers', weight: 5 },
      { id: 'bal-mlb', name: 'Orioles', weight: 4 },
      { id: 'min', name: 'Twins', weight: 3 },
      { id: 'pit', name: 'Pirates', weight: 2 },
    ],
  },
]

export const SAMPLE_TEMPLATE = BREAK_TEMPLATES[0]!
