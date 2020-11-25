import { Room } from 'colyseus';
import { Schema, type } from '@colyseus/schema';

class Bunny extends Schema {
  @type("number")
  x = 10;
}

class GameState extends Schema {
  @type(Bunny)
  bunny: Bunny = new Bunny();
}

export class GameRoom extends Room<GameState> {
  onCreate (){
      this.setState(new GameState())
      setInterval(() => this.state.bunny.x++, 50);
  }
}
