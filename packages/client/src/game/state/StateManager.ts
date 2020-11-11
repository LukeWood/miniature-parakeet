import { ColyseusService } from '../../services/colyseus'
import { Room } from 'colyseus.js';

import {GameState} from './types';

export class StateManager {
  room?: Room

  local: GameState;
  server: GameState;
  x: number = 0;

  constructor(private readonly colyseus: ColyseusService, private readonly lobby: string) {
    this.setup()
    this.local = 'zero'
    this.server = 'zero'
  }

  async setup() {
    this.room = await this.getGameRoom();
  }

  async getGameRoom(): Promise<Room> {
    if (this.lobby === 'new') {
      return await this.colyseus.client.create('game', {})
    } else if (this.lobby === 'random') {
      return await this.colyseus.client.joinOrCreate('game', {})
    } else {
      return await this.colyseus.client.joinById(this.lobby, {})
    }
    throw "Error, got to end of getGameRoom"
  }

  update() {
    if (!this.room || this.server === 'zero') {
      return
    }

    this.server = this.room.state;
  }

  getGameState(): GameState {
    this.x++;
    return {
      x: this.x
    }
  }

}
