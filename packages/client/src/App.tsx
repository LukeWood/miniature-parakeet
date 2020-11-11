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
      'ws',
      'localhost',
      '8001'
    );
  }
  render() {
    return (
      <Suspense fallback={< div > Loading...</div>}>
        <Router>
          <Game colyseus={this.colyseus} path="/game/:roomId" />
          <Home path="/" />
        </Router>
      </Suspense >
    );
  }
}

export default App;
