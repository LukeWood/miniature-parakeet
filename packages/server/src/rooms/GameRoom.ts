import { Room, Client } from 'colyseus';
import {GameState, Player} from './game/GameState';

export class GameRoom extends Room<GameState> {
  onCreate (){
      this.setState(new GameState())
      setInterval(() => this.state.bunny.x++, 50);
      this.registerMessages()
  }

  onJoin(client: Client, _: any, _2: any) {
    this.state.players[client.id] = new Player(
      /*name=*/"luke",
      /*host=*/this.state.players.size === 0
    );
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
