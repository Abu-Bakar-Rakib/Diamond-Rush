import { GameMode, LevelInfo, LevelConfig, Tile } from './types';

export const LEVEL_METADATA: Record<GameMode, LevelInfo> = {
  EASY: {
    id: 'EASY',
    name: 'Emerald Caverns',
    subtitle: 'Sector 01 — Low Hazard Cave',
    description: 'Generous dirt pathways with minimal boulders. Ideal for surveying mechanics and learning gravity routes.',
    color: '#34d399', // Emerald
    badgeBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    diamonds: 13,
    rocks: 2,
    difficultyRating: 1,
    hazardLevel: 'LOW',
  },
  MEDIUM: {
    id: 'MEDIUM',
    name: 'Granite Depths',
    subtitle: 'Sector 02 — Classic Boulder Puzzle',
    description: 'Strategic rock clusters supported by stone pillars. Push boulders methodically and dig with foresight.',
    color: '#fbbf24', // Amber/Gold
    badgeBg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
    diamonds: 14,
    rocks: 8,
    difficultyRating: 3,
    hazardLevel: 'MEDIUM',
  },
  HARD: {
    id: 'HARD',
    name: 'Obsidian Core',
    subtitle: 'Sector 03 — Unstable Magma Vault',
    description: 'Dense hanging rock formations and hollow chambers. One wrong step can trigger a crushing chain reaction.',
    color: '#f87171', // Crimson/Red
    badgeBg: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
    diamonds: 18,
    rocks: 19,
    difficultyRating: 5,
    hazardLevel: 'EXTREME',
  },
};

export function countStats(layout: string[]): { diamonds: number; rocks: number } {
  let diamonds = 0;
  let rocks = 0;
  for (const row of layout) {
    for (const char of row) {
      if (char === '*') diamonds++;
      if (char === 'O') rocks++;
    }
  }
  return { diamonds, rocks };
}

// 5 Handcrafted levels for EASY mode
const EASY_LAYOUTS = [
  // Level 1: Emerald Basics (Easy start)
  [
    'P................E',
    'dd*ddd*ddd*ddd*ddd',
    'dddddddddddddddddd',
    'd*dddd*dddd*dddd*d',
    'dddddddddddddddddd',
    'ddddOddddddddOdddd',
    'dddddddddddddddddd',
    'd*dddddd*ddddd*ddd',
    'dddddddddddddddddd',
    'dddddddddddddddddd',
    'ddd*dddddddd*ddddd',
    'dddddddddddddddddd',
    'dddddddddddddddddd',
  ],
  // Level 2: Quartz Shafts (Shafts & drops)
  [
    'P.dd..dd..dd..dd.E',
    '..dd..dd..dd..dd..',
    'dd*ddddd*ddddd*ddd',
    'd.dd.d.dd.d.dd.d.d',
    'ddOdddddOdddddOddd',
    'd.dd.d.dd.d.dd.d.d',
    'dd*ddddd*ddddd*ddd',
    'd.dd.d.dd.d.dd.d.d',
    'ddOdddddOdddddOddd',
    'd.dd.d.dd.d.dd.d.d',
    'dd*ddddd*ddddd*ddd',
    'd.dd.d.dd.d.dd.d.d',
    'dddddddddddddddddd',
  ],
  // Level 3: Jade Chambers (Chambers & boulders)
  [
    'P..d...d...d...d.E',
    'ddOd.ddOd.ddOd.ddO',
    'dd*d.dd*d.dd*d.dd*',
    'd.dd.d.dd.d.dd.d.d',
    'dd*d.dd*d.dd*d.dd*',
    'dddd.dddd.dddd.ddd',
    '...d...d...d...d..',
    'ddOd.ddOd.ddOd.ddO',
    'dd*d.dd*d.dd*d.dd*',
    'dddd.dddd.dddd.ddd',
    'dd*d.dd*d.dd*d.dd*',
    'dddd.dddd.dddd.ddd',
    'dddddddddddddddddd',
  ],
  // Level 4: Beryl Corridors (Hanging hazards)
  [
    'P...dddddddddd...E',
    'ddd.d*ddOdd*d.dddd',
    'ddd.ddddddddd.dddd',
    'd...dd*dddd*d...dd',
    'd.ddddddOdddddd.dd',
    'd.dd*dddddddd*d.dd',
    'd...dddddddddd...d',
    'ddd.d*ddOdd*d.dddd',
    'ddd.ddddddddd.dddd',
    'd...dd*dddd*d...dd',
    'd.ddddddOdddddd.dd',
    'd.dd*dddddddd*d.dd',
    'dddddddddddddddddd',
  ],
  // Level 5: Emerald Vault (Grand Cavern)
  [
    'P.....dddddd.....E',
    'dd*dd.ddOddd.dd*dd',
    'ddddd.dd*ddd.ddddd',
    'd*ddOddddddddOdd*d',
    'dddddd.d**d.dddddd',
    'ddOddd.dddd.dddOdd',
    'dd*ddd.d**d.ddd*dd',
    'dddddd.dddd.dddddd',
    'd*ddOddddddddOdd*d',
    'ddddd.dd*ddd.ddddd',
    'dd*dd.ddOddd.dd*dd',
    'dddddddddddddddddd',
    'dddddddddddddddddd',
  ],
];

// 5 Handcrafted levels for MEDIUM mode
const MEDIUM_LAYOUTS = [
  // Level 1: Granite Quarry
  [
    'P................E',
    'dd*dddddOddddd*ddd',
    'd...ddd##.ddd...dd',
    'd*ddOdd*dddddOd*dd',
    'ddd...dd#...ddd...',
    'dd*dddddOdd*ddd*dd',
    'ddd...d##...ddd...',
    'd*dddddOdd*dd*dddd',
    'ddd...dd#...ddd...',
    'ddO*dddddOdddd*ddd',
    'ddd...dd#...ddd...',
    'd*dddddd*dddddO*dd',
    'dddddddddddddddddd',
  ],
  // Level 2: Stalactite Maze
  [
    'P..dd..dd..dd..d.E',
    'dd.OO..OO..OO..Odd',
    'dd.dd..dd..dd..ddd',
    'dd.**..**..**..*dd',
    'dd.dd..dd..dd..ddd',
    '...dd..dd..dd..dd.',
    'dd.OO..OO..OO..Odd',
    'dd.dd..dd..dd..ddd',
    'dd.**..**..**..*dd',
    'dd.dd..dd..dd..ddd',
    '...dd..dd..dd..dd.',
    'dd.OO..OO..OO..Odd',
    'dddddddddddddddddd',
  ],
  // Level 3: Cobalt Trenches
  [
    'P.dd.dd.dd.dd.dd.E',
    '..dd.dd.dd.dd.dd..',
    'ddOd.dd*d.ddOd.dd*',
    'dd*d.ddOd.dd*d.ddO',
    'd.dd.d.dd.d.dd.d.d',
    'ddOd.dd*d.ddOd.dd*',
    'dd*d.ddOd.dd*d.ddO',
    'd.dd.d.dd.d.dd.d.d',
    'ddOd.dd*d.ddOd.dd*',
    'dd*d.ddOd.dd*d.ddO',
    'd.dd.d.dd.d.dd.d.d',
    'dd*d.dd*d.dd*d.dd*',
    'dddddddddddddddddd',
  ],
  // Level 4: Sulfur Caverns
  [
    'P.....O....O.....E',
    'dd*dd#dd*dd#dd*ddd',
    'ddOdd#ddOdd#ddOddd',
    'dd.dd#dd.dd#dd.ddd',
    'dd*dd#dd*dd#dd*ddd',
    'ddOdd#ddOdd#ddOddd',
    'dd.dd#dd.dd#dd.ddd',
    'dd*dd#dd*dd#dd*ddd',
    'ddOdd#ddOdd#ddOddd',
    'dd.dd#dd.dd#dd.ddd',
    'dd*dddddddddddd*dd',
    'dddddddddddddddddd',
    'dddddddddddddddddd',
  ],
  // Level 5: Granite Depths Master
  [
    'P................E',
    'dd*dddddOddddd*ddd',
    'd...ddd##.ddd...dd',
    'd*ddOdd*dddddOd*dd',
    'ddd...dd#...ddd...',
    'Od*dddddOdd*ddd*dd',
    'ddd...d##...ddd...',
    'd*dddddOdd*dd*ddOd',
    'ddd...dd#...ddd...',
    'ddO*dddddOdddd*ddd',
    'ddd...dd#...ddd...',
    'd*dddddd*dddddO*dd',
    'dddddddddddddddddd',
  ],
];

// 5 Handcrafted levels for HARD mode
const HARD_LAYOUTS = [
  // Level 1: Obsidian Gateway
  [
    'P....O.....O.....E',
    'dd*dOd*ddOd*dOd*dd',
    'dOdd.ddOd.ddOdd.dd',
    'd*dOd*ddd*dOd*ddOd',
    'dd.ddOdd.ddOdd.ddd',
    'dd*dd#Od*d#dd*dOd.',
    'd.dddd#ddd.#dddd.d',
    'd*dOd*ddOdd*dOdd*d',
    'ddd.ddOdd.ddOd.ddd',
    'dOdd*dddO*ddd*dOdd',
    'dd.ddOdd.ddOdd.ddd',
    'd*ddOd*ddOd*ddOd*d',
    'dddddddddddddddddd',
  ],
  // Level 2: Magma Chambers
  [
    'P.O..d..O..d..O..E',
    'dd*dd#dd*dd#dd*ddd',
    'dOd.d#dOd.d#dOd.dd',
    'd*dOd#d*dOd#d*dOdd',
    'd.d.d#d.d.d#d.d.dd',
    'dd*dd#dd*dd#dd*ddd',
    'dOd.d#dOd.d#dOd.dd',
    'd*dOd#d*dOd#d*dOdd',
    'd.d.d#d.d.d#d.d.dd',
    'dd*dd#dd*dd#dd*ddd',
    'dOd.d#dOd.d#dOd.dd',
    'd*dOd#d*dOd#d*dOdd',
    'dddddddddddddddddd',
  ],
  // Level 3: Volcanic Descent
  [
    'P.d.d.d.d.d.d.d.dE',
    '..O.O.O.O.O.O.O.O.',
    'dd*d*d*d*d*d*d*d*d',
    'd.d.d.d.d.d.d.d.d.',
    'ddOdOdOdOdOdOdOdOd',
    'dd*d*d*d*d*d*d*d*d',
    'd.d.d.d.d.d.d.d.d.',
    'ddOdOdOdOdOdOdOdOd',
    'dd*d*d*d*d*d*d*d*d',
    'd.d.d.d.d.d.d.d.d.',
    'ddOdOdOdOdOdOdOdOd',
    'dd*d*d*d*d*d*d*d*d',
    'dddddddddddddddddd',
  ],
  // Level 4: Basalt Labyrinth
  [
    'P...O.....O......E',
    'd##dOd##dOd##dOd##',
    'd#*dd#d#*dd#d#*dd#',
    'd#Odd#d#Odd#d#Odd#',
    'd#*dd#d#*dd#d#*dd#',
    '...O.....O.....O..',
    'd##dOd##dOd##dOd##',
    'd#*dd#d#*dd#d#*dd#',
    'd#Odd#d#Odd#d#Odd#',
    'd#*dd#d#*dd#d#*dd#',
    '...O.....O.....O..',
    'd#*d*d#d*d*d#d*d*d',
    'dddddddddddddddddd',
  ],
  // Level 5: Obsidian Core Master
  [
    'P....O.....O.....E',
    'dd*dOd*ddOd*dOd*dd',
    'dOdd.ddOd.ddOdd.dd',
    'd*dOd*ddd*dOd*ddOd',
    'dd.ddOdd.ddOdd.ddd',
    'dOd*dd#Od*d#dd*dOd',
    'd.dddd#ddd.#dddd.d',
    'd*dOd*ddOdd*dOdd*d',
    'ddd.ddOdd.ddOd.ddd',
    'dOdd*dddO*ddd*dOdd',
    'dd.ddOdd.ddOdd.ddd',
    'd*ddOd*ddOd*ddOd*d',
    'dddddddddddddddddd',
  ],
];

export const MODE_LEVELS: Record<GameMode, LevelConfig[]> = {
  EASY: [
    {
      levelNumber: 1,
      name: 'Emerald Basics',
      subtitle: 'Sector 01 — Stage 1',
      description: 'Generous dirt pathways with minimal boulders. Survey mechanics and gather sparkling emeralds.',
      ...countStats(EASY_LAYOUTS[0]),
      layout: EASY_LAYOUTS[0],
    },
    {
      levelNumber: 2,
      name: 'Quartz Shafts',
      subtitle: 'Sector 01 — Stage 2',
      description: 'Vertical tunnels with perched boulders. Learn how gravity pulls rocks into excavated gaps.',
      ...countStats(EASY_LAYOUTS[1]),
      layout: EASY_LAYOUTS[1],
    },
    {
      levelNumber: 3,
      name: 'Jade Chambers',
      subtitle: 'Sector 01 — Stage 3',
      description: 'Interconnected rooms with diamond caches. Dig methodically to reach the exit portal.',
      ...countStats(EASY_LAYOUTS[2]),
      layout: EASY_LAYOUTS[2],
    },
    {
      levelNumber: 4,
      name: 'Beryl Corridors',
      subtitle: 'Sector 01 — Stage 4',
      description: 'Winding cavern routes protected by hanging stone. Mind your step under suspended rocks.',
      ...countStats(EASY_LAYOUTS[3]),
      layout: EASY_LAYOUTS[3],
    },
    {
      levelNumber: 5,
      name: 'Emerald Vault',
      subtitle: 'Sector 01 — Final Stage',
      description: 'The master cavern of the Emerald sector. Collect all gems to power the extraction portal.',
      ...countStats(EASY_LAYOUTS[4]),
      layout: EASY_LAYOUTS[4],
    },
  ],
  MEDIUM: [
    {
      levelNumber: 1,
      name: 'Granite Quarry',
      subtitle: 'Sector 02 — Stage 1',
      description: 'Strategic rock clusters supported by stone pillars. Push boulders horizontally into empty shafts.',
      ...countStats(MEDIUM_LAYOUTS[0]),
      layout: MEDIUM_LAYOUTS[0],
    },
    {
      levelNumber: 2,
      name: 'Stalactite Maze',
      subtitle: 'Sector 02 — Stage 2',
      description: 'Precarious pairs of boulders balancing on dirt pillars. Clear paths without blocking your route.',
      ...countStats(MEDIUM_LAYOUTS[1]),
      layout: MEDIUM_LAYOUTS[1],
    },
    {
      levelNumber: 3,
      name: 'Cobalt Trenches',
      subtitle: 'Sector 02 — Stage 3',
      description: 'Alternating trenches demanding Sokoban-style boulder pushing to unlock diamond alcoves.',
      ...countStats(MEDIUM_LAYOUTS[2]),
      layout: MEDIUM_LAYOUTS[2],
    },
    {
      levelNumber: 4,
      name: 'Sulfur Caverns',
      subtitle: 'Sector 02 — Stage 4',
      description: 'Multi-tiered cavern shafts where boulders drop fast. Time your movements and dig safely.',
      ...countStats(MEDIUM_LAYOUTS[3]),
      layout: MEDIUM_LAYOUTS[3],
    },
    {
      levelNumber: 5,
      name: 'Granite Fortress',
      subtitle: 'Sector 02 — Final Stage',
      description: 'Dense granite maze with classic retro puzzle difficulty. Full diamond quota required.',
      ...countStats(MEDIUM_LAYOUTS[4]),
      layout: MEDIUM_LAYOUTS[4],
    },
  ],
  HARD: [
    {
      levelNumber: 1,
      name: 'Obsidian Gateway',
      subtitle: 'Sector 03 — Stage 1',
      description: 'Dense hanging rocks and hollow chambers. One wrong step can trigger a crushing chain reaction.',
      ...countStats(HARD_LAYOUTS[0]),
      layout: HARD_LAYOUTS[0],
    },
    {
      levelNumber: 2,
      name: 'Magma Chambers',
      subtitle: 'Sector 03 — Stage 2',
      description: 'Columns of heavy stone suspended over rich diamond deposits. Dig with surgical precision.',
      ...countStats(HARD_LAYOUTS[1]),
      layout: HARD_LAYOUTS[1],
    },
    {
      levelNumber: 3,
      name: 'Volcanic Descent',
      subtitle: 'Sector 03 — Stage 3',
      description: 'Stacked rock matrices with diamonds nestled inside. Beware of rolling boulders.',
      ...countStats(HARD_LAYOUTS[2]),
      layout: HARD_LAYOUTS[2],
    },
    {
      levelNumber: 4,
      name: 'Basalt Labyrinth',
      subtitle: 'Sector 03 — Stage 4',
      description: 'Intricate puzzle layout requiring strategic boulder placement into empty drop-pits.',
      ...countStats(HARD_LAYOUTS[3]),
      layout: HARD_LAYOUTS[3],
    },
    {
      levelNumber: 5,
      name: 'Obsidian Core Master',
      subtitle: 'Sector 03 — Final Stage',
      description: 'The ultimate cave expedition challenge. Maximum boulders, crushing hazards, and diamond quota.',
      ...countStats(HARD_LAYOUTS[4]),
      layout: HARD_LAYOUTS[4],
    },
  ],
};

export const TOTAL_LEVELS_PER_MODE = 5;

export const COLS = 20;
export const ROWS = 15;
export const TILE_SIZE = 40;
export const CANVAS_WIDTH = COLS * TILE_SIZE;
export const CANVAS_HEIGHT = ROWS * TILE_SIZE;

export function getLevelConfig(mode: GameMode, levelNumber: number): LevelConfig {
  const levels = MODE_LEVELS[mode];
  const safeNumber = Math.max(1, Math.min(TOTAL_LEVELS_PER_MODE, levelNumber));
  return levels[safeNumber - 1] || levels[0];
}

export function buildGrid(mode: GameMode, levelNumber = 1): Tile[][] {
  const config = getLevelConfig(mode, levelNumber);
  const interior = config.layout.map((r) => r.padEnd(18, 'd').slice(0, 18));
  const fullLevel = ['#'.repeat(COLS), ...interior.map((r) => `#${r}#`), '#'.repeat(COLS)];
  return fullLevel.map((row) => row.split('') as Tile[]);
}
