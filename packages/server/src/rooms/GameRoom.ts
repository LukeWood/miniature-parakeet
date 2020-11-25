import { Room, Client } from 'colyseus';
import {GameState, Player} from './game/GameState';

interface options {
  name?: string
}

function normalizeName(name?: string): string {
  if (!name) {
    return "nameless"
  }
  return name;
}

export class GameRoom extends Room<GameState> {
  onCreate (){
      this.setState(new GameState())
      setInterval(() => this.state.bunny.x++, 50);
      this.registerMessages()
  }

  onJoin(client: Client, options: options, _2: any) {
    this.state.players[client.id] = new Player(
      /*name=*/normalizeName(options.name),
      /*host=*/this.state.players.size === 0
    );
  }

  onLeave(client: Client, _consent: boolean) {
    if (!this.state.players[client.sessionId]) {
      return;
    }
    const host = this.state.players[client.sessionId];
    this.state.players.delete(client.sessionId);
    if (!host) {
      return;
    }

    // assign new host
    const new_host = this.state.players.keys().next();
    if (new_host.done) {
      // room is empty
      return;
    }

    this.state.players[new_host.value].host = true;
  }

  registerMessages() {
    this.onMessage("start", (client) => {
      if (!this.state.players[client.sessionId]?.host) {
        throw 'Unpermitted operation'
      }
      this.enterDeathmatch();
    })
  }

  enterDeathmatch() {
    this.state.lifecycle = 'deathmatch';
    this.lock()
  }

  enterLobby() {
    this.state.lifecycle = 'lobby';
    this.unlock();
  }

}
