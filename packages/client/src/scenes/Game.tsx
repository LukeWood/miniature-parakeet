import React, { Component, ReactNode } from 'react';
import { RouteComponentProps } from '@reach/router';

import { StateManager } from '../game/state/StateManager';
import { GameView } from '../game/view/GameView';
import { ColyseusService } from '@bulletz/client/src/services/colyseus'

interface IProps extends RouteComponentProps {
  colyseus: ColyseusService
}

interface IState { }

export default class Game extends Component<IProps, IState>{
  stateManager: StateManager;

  constructor(props: IProps) {
    super(props)
    this.stateManager = new StateManager(this.props.colyseus)
  }

  render(): ReactNode {
    return <GameView stateManager={this.stateManager}></GameView>
  }

}
