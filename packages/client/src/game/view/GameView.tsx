import React, { useEffect, useState } from 'react';
import { StateManager } from '../state/StateManager';
import { GameState } from '../state/types';

import { useWindowSize, useDisableScroll } from '../../hooks';

import { Stage, AppConsumer, Sprite } from '@inlet/react-pixi';

interface IProps {
  stateManager: StateManager;
}

interface GameRenderComponentProps {
  app: PIXI.Application;
  stateManager: StateManager;
}

interface GameDisplayComponentProps {
  state: GameState;
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

  const [state, setState] = useState<GameState>(null)
  useEffect(() => {
    let cancelled = false;
    let render = () => {
      if (cancelled) {
        return;
      }
      setState(props.stateManager.getGameState())
      requestAnimationFrame(render)
    }
    requestAnimationFrame(render)
    return () => {
      cancelled = true;
    }
  })

  return (<Stage
    raf
    width={size.width}
    height={size.height}
    className="game-view"
  >
    <GameDisplayComponent state={state} />
  </Stage>)
}
