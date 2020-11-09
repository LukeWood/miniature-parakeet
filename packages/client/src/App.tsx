import React, { Component, lazy, Suspense } from 'react';

import { globalHistory, Router, navigate, HistoryUnsubscribe } from '@reach/router';
import { ColyseusService } from 'services/colyseus';

const Game = lazy(() => import('./scenes/Game'));
const Home = lazy(() => import("./scenes/Home"));

interface IProps { }
class App extends Component {
  colyseus: ColyseusService;
  constructor(props: IProps) {
    super(props)
    this.colyseus = new ColyseusService(
      process.env.NODE_ENV !== 'production' ? 'ws' : (window.location.protocol !== 'https:' ? 'ws' : 'wss'),
      process.env.NODE_ENV !== 'production' ? 'localhost' : 'game.tp-scramble.io',
      String(process.env.NODE_ENV !== 'production' ? 8001 : window.location.port)
    );
  }
  render() {
    return (
      <Suspense fallback={< div > Loading...</div>}>
        <Router>
          <Game colyseus={this.colyseus} path="/game" />
          <Home path="/" />
        </Router>
      </Suspense >
    );
  }
}

export default App;
