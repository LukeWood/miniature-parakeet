import { Schema, type, MapSchema } from '@colyseus/schema';

class Bunny extends Schema {
  @type("number")
  x = 10;
}

type GameLifecycle = 'lobby' | 'deathmatch';

export class Player extends Schema {
  @type("string")
  name: string;

  @type("boolean")
  host: boolean;

  constructor(name: string, host: boolean) {
    super()
    this.name = name;
    this.host = host;
  }
}

export class GameState extends Schema {
  @type("boolean")
  first: boolean = false;

  @type(Bunny)
  bunny: Bunny = new Bunny();

  @type("string")
  lifecycle: GameLifecycle  = "lobby";

  @type({map: Player})
  players = new MapSchema<Player>();
}
