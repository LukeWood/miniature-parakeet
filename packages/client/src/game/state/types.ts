export interface IGameState {
  lifecycle: 'lobby' | 'deathmatch';
  x: number;
  players: {[key: string]: Player};
}

export interface Player {
  name: string;
  host: boolean;
}

export type GameState = IGameState | null;
