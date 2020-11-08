import { ColyseusService } from '../../services/colyseus'

export interface Player {
  x: number;
  y: number;
  sprite: string;
  id: string;
}

export class StateManager {
  players: Player[] = [];

  constructor(private readonly colyseus: ColyseusService) {

  }

  getGameState() {
    return {
      players: this.players
    }
  }

}
