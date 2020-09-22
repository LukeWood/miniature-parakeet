interface Player {
  x: number;
  y: number;
}

export class StateManager {
  players: Player[] = [];

  constructor() {
    this.players.push({ x: 50, y: 50 })
  }

  getGameState() {
    return {
      players: this.players
    }
  }

}
