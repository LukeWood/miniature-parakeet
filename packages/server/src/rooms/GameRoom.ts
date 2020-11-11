import { Client, Room } from 'colyseus';
import { Schema, type } from '@colyseus/schema';

class GameState extends Schema {
  @type("string")
  roomName: string;
}

export class GameRoom extends Room<GameState> {
  onCreate (){
      this.setState(new GameState())
      this.state.roomName = "HELLO"
  }
}
