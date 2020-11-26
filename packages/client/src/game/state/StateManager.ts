import { ColyseusService } from '../../services/colyseus'
import { Room } from 'colyseus.js';
import {BehaviorSubject, ReplaySubject, Subject, Observable} from 'rxjs';
import {filter, pairwise, map} from 'rxjs/operators';

import {Maths} from '@bulletz/common';

import {GameState, IPlayer} from './types';

type PlayerKeys = Array<keyof IPlayer>;

export function isLobbyRenderState(v: any): v is LobbyRenderState {
  return v && 'isLobbyState' in v;
}
export interface LobbyRenderState {
  isLobbyState: true;
  sessionId: string;
  players: {[key: string]: IPlayer};
  room: Room;
}

export interface GameRenderState {
  isGameRenderState: true;
  frame: number;
  players: {[key: string]: IPlayer};
}

function stateCompare(s1: any, s2: any) {
  var {room, ...rest} = s1;
  var {room, ...rest2} = s2;
  const str1 = JSON.stringify(rest)
  const str2 = JSON.stringify(rest2)
  return str1 !== str2;
}

function diffStates(states: RenderState[]): boolean {
  if (states.length != 2) {
    throw 'states must have length 2';
  }
  const [s1, s2] = states;
//  console.log(s1, s2)
  // loading done state
  if (s1 == null ){
    return true;
  }

  // when in the lobby mode we only render when we get a difference in our deep compare
  if (isLobbyRenderState(s2)) {
    return stateCompare(s1, s2);
  }

  return true;
}

export type RenderState = LobbyRenderState | GameRenderState | null;

export class StateManager {
  room?: Room
  roomId: ReplaySubject<string>;

  clientState: GameState = null;
  serverState: GameState = null;

  rawStates$: BehaviorSubject<RenderState> = new BehaviorSubject<RenderState>(null);
  state$: Observable<RenderState> = this.rawStates$
    .pipe(
      pairwise(),
      filter(diffStates),
      map((arr) => arr[1])
    )

  constructor(private readonly colyseus: ColyseusService, private readonly lobby: string) {
    this.roomId = new ReplaySubject(1);
    setInterval(() => this.tick((Date).now()), 50)
  }

  lastTick: number = (Date).now();
  async setup() {
    this.room = await this.getGameRoom();
    this.roomId.next(this.room.id);
    this.room.onStateChange(v => {
      this.serverState = v;
      this.tick((Date).now());
      this.rawStates$.next(this.getGameState());
    })
  }

  async getGameRoom(): Promise<Room> {
    const options = {
      name: localStorage.getItem('name'),
    }
    if (this.lobby === 'new') {
      return await this.colyseus.client.create('game', options)
    } else if (this.lobby === 'random') {
      return await this.colyseus.client.joinOrCreate('game', options)
    } else {
      return await this.colyseus.client.joinById(this.lobby, options)
    }
  }

  stateCopy(gs: GameState): GameState {
    if (gs == null ){
      return null;
    }

    return {
      lifecycle: gs.lifecycle,
      players: {}
    }
  }


  tick(time: number) {
    const dx =  time- this.lastTick;
    this.lastTick = time;
    if (!this.serverState) {
      return;
    }

    if (!this.clientState) {
      this.clientState = this.stateCopy(this.serverState);
    }
    if (!this.clientState) {
      // impossible but need for ts.
      return;
    }

    this.clientState.lifecycle = this.serverState.lifecycle;

    const rawCopyPlayerProperties: PlayerKeys = ['host', 'name']
    for (let pid of Object.keys(this.serverState.players)) {
      const servPlayer = this.serverState.players[pid];

      if (!this.clientState.players[pid]) {
        this.clientState.players[pid] = {
          x: servPlayer.x,
          y: servPlayer.y,
          host: servPlayer.host,
          name: servPlayer.name
        }
        continue;
      }

      const player = this.clientState.players[pid];
      this.clientState.players[pid].x = Maths.lerp(player.x, servPlayer.x, dx/100) // Update to deltaTime/50.
      this.clientState.players[pid].y = Maths.lerp(player.y, servPlayer.y, dx/100) // Update to deltaTime/50.
    }
  }

  getGameState(): RenderState {
    if (!this.room || !this.clientState) {
      return null;
    }

    if (this.clientState.lifecycle === 'lobby') {
      return {
        isLobbyState: true,
        sessionId: this.room!.sessionId,
        players: Object.assign({}, this.clientState.players),
        room: this.room!
      }
    }

    if (this.clientState.lifecycle === 'deathmatch') {
      return {
        isGameRenderState: true,
        frame: Date.now(),
        players: Object.assign({}, this.clientState.players)
      }
    }

    return null;
  }

}
