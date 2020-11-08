import React, { Component, ReactNode } from 'react';

import { StateManager } from './state/StateManager';
import { GameView } from './view/GameView';
import { ColyseusService } from '../services/colyseus'

interface IProps { }

interface IState { }

export class Game extends Component<IProps, IState>{

  colyseusService: ColyseusService;
  stateManager: StateManager;

  constructor(props: IProps) {
    super(props)
    this.colyseusService = new ColyseusService('ws', 'localhost', '8001')
    this.stateManager = new StateManager(this.colyseusService)
  }

  render(): ReactNode {
    return <GameView stateManager={this.stateManager}></GameView>
  }

}
