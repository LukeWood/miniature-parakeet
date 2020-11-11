interface IGameState {
  x: number;
}

export type GameState = IGameState | 'zero';
