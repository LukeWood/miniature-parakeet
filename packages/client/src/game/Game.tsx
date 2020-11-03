import React, { Component, ReactNode } from 'react';

import { StateManager } from './state/StateManager';
import { GameView } from './view/GameView';

interface IProps {}

interface IState {}

export class Game extends Component<IProps, IState>{

  stateManager: StateManager = new StateManager();

  render(): ReactNode {
    return <GameView stateManager={this.stateManager}></GameView>
  }

}
