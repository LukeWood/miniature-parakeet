export interface Player {
  x: number;
  y: number;
  sprite: string;
  id: string;
}

export class StateManager {
  players: Player[] = [];

  constructor() {
    const player1 ={id: '1234',sprite: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/693612/IaUrttj.png', x: 50, y: 50 };
    this.players.push({id: '1234',sprite: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/693612/IaUrttj.png', x: 50, y: 50 });
    this.players.push(player1);
    setInterval(() => player1.x++, 50);
  }

  getGameState() {
    return {
      players: this.players
    }
  }

}
