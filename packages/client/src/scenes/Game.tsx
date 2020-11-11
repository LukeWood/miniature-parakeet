import React, { Component, ReactNode } from 'react';
import { RouteComponentProps } from '@reach/router';

import { StateManager } from '../game/state/StateManager';
import { GameView } from '../game/view/GameView';
import { ColyseusService } from '@bulletz/client/src/services/colyseus'

interface IProps extends RouteComponentProps {
  colyseus: ColyseusService
  roomId?: string
}

interface IState { }

export default class Game extends Component<IProps, IState>{
  stateManager: StateManager;

  constructor(props: IProps) {
    super(props)
    this.stateManager = new StateManager(this.props.colyseus, this.props.roomId || 'new')
  }

  render(): ReactNode {
    return <GameView stateManager={this.stateManager}></GameView>
  }

}
