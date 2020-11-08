import React, { Component, ReactNode } from 'react';

import { StateManager } from './state/StateManager';
import { GameView } from './view/GameView';
import { ColyseusService } from '@client/services/colyseus'

interface IProps { }

interface IState { }

export class Game extends Component<IProps, IState>{

  colyseusService: ColyseusService;
  stateManager: StateManager;

  constructor() {
    this.stateManager = new StateManager()

  }

  render(): ReactNode {
    return <GameView stateManager={this.stateManager}></GameView>
  }

}
