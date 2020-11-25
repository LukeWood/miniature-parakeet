import React, { useEffect, useState } from 'react';
import { StateManager, RenderState, GameRenderState, isLobbyRenderState } from '../state/StateManager';

import { useWindowSize, useDisableScroll } from '../../hooks';
import {LobbyStateView} from './LobbyView';

import { Stage, Sprite } from '@inlet/react-pixi';

interface IProps {
  stateManager: StateManager;
}

interface GameDisplayComponentProps {
  state: GameRenderState;
}

const GameDisplayComponent = (props: GameDisplayComponentProps) => {
  if (props.state === null) {
    return <></>
  }
  return <>
    <Sprite image={'https://s3-us-west-2.amazonaws.com/s.cdpn.io/693612/IaUrttj.png'} x={props.state.x} y={props.state.x} />
  </>
}

export const GameView = (props: IProps) => {
  const size = useWindowSize();
  useDisableScroll();

  const [state, setState] = useState<RenderState>(null)
  useEffect(() => {
    const s = props.stateManager.state$.subscribe(s => {
      setState(s)
    })
    return () => {
      s.unsubscribe();
    }
  })

  if (state == null) {
    return <div>Loading...</div>
  }

  if (isLobbyRenderState(state)) {
    return <LobbyStateView state={state}/>
  }

  return (<Stage
    raf
    width={size.width}
    height={size.height}
    className="game-view"
  >
    <GameDisplayComponent state={state} />
  </Stage>)
}
