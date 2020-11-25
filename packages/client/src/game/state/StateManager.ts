import { ColyseusService } from '../../services/colyseus'
import { Room } from 'colyseus.js';
import {BehaviorSubject, ReplaySubject, Subject, Observable} from 'rxjs';
import {filter, pairwise, map, tap} from 'rxjs/operators';

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
  errors: Subject<Error>;
  state: GameState = null;
  rawStates$: BehaviorSubject<RenderState> = new BehaviorSubject<RenderState>(null);
  state$: Observable<RenderState> = this.rawStates$
    .pipe(
      pairwise(),
      filter(diffStates),
      map((arr) => arr[1])
    )

  constructor(private readonly colyseus: ColyseusService, private readonly lobby: string) {
    this.roomId = new ReplaySubject(1);
    this.errors = new Subject();
  }

  async setup() {
    this.room = await this.getGameRoom();
    this.roomId.next(this.room.id);
    this.room.onStateChange(v => {
      this.state = v;
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
