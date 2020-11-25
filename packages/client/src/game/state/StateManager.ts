import { ColyseusService } from '../../services/colyseus'
import { Room } from 'colyseus.js';
import {ReplaySubject, Subject} from 'rxjs';

import {GameState, Player} from './types';

export function isLobbyRenderState(v: any): v is LobbyRenderState {
  return v && 'isLobbyState' in v;
}
export interface LobbyRenderState {
  isLobbyState: true;
  sessionId: string;
  players: {[key: string]: Player};
  room: Room;
}

export interface GameRenderState {
  isGameRenderState: true;
  x: number;
}

export type RenderState = LobbyRenderState | GameRenderState | null;

export class StateManager {
  room?: Room
  roomId: ReplaySubject<string>;
  errors: Subject<Error>;
  state: GameState = null;

  constructor(private readonly colyseus: ColyseusService, private readonly lobby: string) {
    this.roomId = new ReplaySubject(1);
    this.errors = new Subject();
  }

  async setup() {
    this.room = await this.getGameRoom();
    this.roomId.next(this.room.id);
    this.room.onStateChange(v => {
      this.state = v;
    })
  }

  async getGameRoom(): Promise<Room> {
    if (this.lobby === 'new') {
      return await this.colyseus.client.create('game', {})
    } else if (this.lobby === 'random') {
      return await this.colyseus.client.joinOrCreate('game', {})
    } else {
      return await this.colyseus.client.joinById(this.lobby, {})
    }
  }

  getGameState(): RenderState {
    if (!this.room || !this.state) {
      return null;
    }

    if (this.state.lifecycle === 'lobby') {
      return {
        isLobbyState: true,
        sessionId: this.room!.sessionId,
        players: this.state.players,
        room: this.room!
      }
    }


    if (this.state.lifecycle === 'deathmatch') {
      return   {
        isGameRenderState: true,
        x: 0
      }
    }

    return null;
  }

}
