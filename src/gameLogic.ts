import { GameMode, GameState, Tile } from './types';
import { buildGrid, COLS, ROWS } from './levels';
import { sounds } from './audio';

export function createNewGame(mode: GameMode, levelNumber = 1, deaths = 0, wins = 0): GameState {
  const grid = buildGrid(mode, levelNumber);
  
  // Pre-settle any initial hanging rocks
  settleGravity(grid);

  let player: [number, number] = [1, 1];
  let total = 0;

  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      if (grid[y][x] === 'P') {
        player = [x, y];
      }
      if (grid[y][x] === '*') {
        total++;
      }
    }
  }

  return {
    grid,
    player,
    collected: 0,
    total,
    moves: 0,
    deaths,
    wins,
    mode,
    levelNumber,
    startTime: Date.now(),
    elapsedSeconds: 0,
    isUnlocked: false,
    isComplete: false,
    isDead: false,
  };
}

export interface GravitySettleResult {
  crushedPlayer: boolean;
  crushRockPos?: [number, number];
  crushPlayerPos?: [number, number];
  crushedByTile?: Tile;
  fellCount: number;
}

export function settleGravity(grid: Tile[][]): GravitySettleResult {
  let fellCount = 0;
  while (true) {
    let moved = false;
    for (let y = ROWS - 2; y >= 1; y--) {
      for (let x = 1; x < COLS - 1; x++) {
        const tile = grid[y][x];
        if (tile !== 'O' && tile !== '*') continue;

        const below = grid[y + 1][x];
        if (below === 'P') {
          // Crushed! Land the boulder on the player
          grid[y + 1][x] = tile;
          grid[y][x] = '.';
          return {
            crushedPlayer: true,
            crushRockPos: [x, y],
            crushPlayerPos: [x, y + 1],
            crushedByTile: tile,
            fellCount: fellCount + 1,
          };
        }
        if (below === '.') {
          grid[y + 1][x] = tile;
          grid[y][x] = '.';
          moved = true;
          fellCount++;
        }
      }
    }
    if (!moved) break;
  }
  return { crushedPlayer: false, fellCount };
}

export interface MoveResult {
  state: GameState;
  moved: boolean;
  event: 'none' | 'dug' | 'pushed' | 'diamond' | 'unlocked' | 'crushed' | 'victory';
  pushedFrom?: [number, number];
  pushedTo?: [number, number];
  dugAt?: [number, number];
  diamondAt?: [number, number];
  crushedAt?: [number, number];
  crushedFrom?: [number, number];
  crushedByTile?: Tile;
}

export function executeMove(state: GameState, dx: number, dy: number): MoveResult {
  if (state.isComplete || state.isDead) {
    return { state, moved: false, event: 'none' };
  }

  const [x, y] = state.player;
  const nx = x + dx;
  const ny = y + dy;

  // Boundary check
  if (nx < 0 || nx >= COLS || ny < 0 || ny >= ROWS) {
    return { state, moved: false, event: 'none' };
  }

  const target = state.grid[ny][nx];

  // Cannot move into wall
  if (target === '#') {
    return { state, moved: false, event: 'none' };
  }

  // Cannot enter exit if locked
  if (target === 'E' && state.collected < state.total) {
    return { state, moved: false, event: 'none' };
  }

  let event: MoveResult['event'] = 'none';
  let pushedFrom: [number, number] | undefined;
  let pushedTo: [number, number] | undefined;
  let dugAt: [number, number] | undefined;
  let diamondAt: [number, number] | undefined;

  // Pushing rock (Sokoban style)
  if (target === 'O') {
    const bx = nx + dx;
    const by = ny + dy;

    if (bx < 0 || bx >= COLS || by < 0 || by >= ROWS || state.grid[by][bx] !== '.') {
      return { state, moved: false, event: 'none' }; // Blocked
    }

    state.grid[by][bx] = 'O';
    event = 'pushed';
    pushedFrom = [nx, ny];
    pushedTo = [bx, by];
    sounds.playPush();
  }

  // Victory: Entering unlocked exit door
  if (target === 'E' && state.collected >= state.total) {
    state.isComplete = true;
    sounds.playVictory();
    return { state, moved: true, event: 'victory' };
  }

  // Digging dirt
  if (target === 'd') {
    event = 'dug';
    dugAt = [nx, ny];
    sounds.playDig();
  }

  // Collecting diamond
  let newCollected = state.collected;
  if (target === '*') {
    newCollected++;
    event = 'diamond';
    diamondAt = [nx, ny];
    sounds.playDiamond();
  }

  // Move player
  state.grid[y][x] = '.';
  state.grid[ny][nx] = 'P';
  state.player = [nx, ny];
  state.collected = newCollected;
  state.moves++;

  // Check if exit unlocked on this move
  if (newCollected === state.total && !state.isUnlocked) {
    state.isUnlocked = true;
    event = 'unlocked';
    sounds.playUnlocked();
  }

  // Gravity settlement
  const gravityResult = settleGravity(state.grid);

  if (gravityResult.fellCount > 0 && !gravityResult.crushedPlayer) {
    sounds.playImpact();
  }

  if (gravityResult.crushedPlayer) {
    state.isDead = true;
    state.deaths++;
    sounds.playDeath();
    return {
      state,
      moved: true,
      event: 'crushed',
      crushedAt: gravityResult.crushPlayerPos || [nx, ny],
      crushedFrom: gravityResult.crushRockPos,
      crushedByTile: gravityResult.crushedByTile,
    };
  }

  return {
    state,
    moved: true,
    event,
    pushedFrom,
    pushedTo,
    dugAt,
    diamondAt,
  };
}
