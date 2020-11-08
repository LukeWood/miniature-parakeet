export interface Player {
  x: number;
  y: number;
  sprite: string;
  id: string;
}

export class StateManager {
  players: Player[] = [];

  constructor(url: string) {
    
  }

  getGameState() {
    return {
      players: this.players
    }
  }

}
