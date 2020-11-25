import { ColyseusService } from '../../services/colyseus'
import { Room } from 'colyseus.js';

import {GameState} from './types';

export class StateManager {
  room?: Room

  constructor(private readonly colyseus: ColyseusService, private readonly lobby: string) {
    this.setup()
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
  }

  getGameState(): GameState {
    if (!this.room?.state?.bunny) {
      return null;
    }
    return {
      x: this.room.state.bunny.x
    }
  }

}
