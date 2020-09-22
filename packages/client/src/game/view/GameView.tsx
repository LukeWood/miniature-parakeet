import React from 'react';
import './GameView.css'
import { StateManager } from '../state/StateManager';

interface IProps {
  stateManager: StateManager;
}

export const GameView = (props: IProps) => {
  return <div>{JSON.stringify(props.stateManager.getGameState().players)}</div>
}
