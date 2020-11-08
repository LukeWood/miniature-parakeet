import React, { useEffect } from 'react';
import { StateManager } from '../state/StateManager';

import { useWindowSize, useDisableScroll } from '../../hooks';

import { Stage, AppConsumer, render } from '@inlet/react-pixi';
import * as PIXI from 'pixi.js';

import { PlayerSprite } from './entities';

interface IProps {
  stateManager: StateManager;
}

interface GameRenderComponentProps {
  app: PIXI.Application;
  stateManager: StateManager;
}

interface GameDisplayComponentProps {
  stateManager: StateManager;
}

const GameDisplayComponent = (props: GameDisplayComponentProps) => {
  return <>
    {props.stateManager.getGameState().players.map((player) => <PlayerSprite key={player.id} player={player} />)}
  </>
}

const loop = (props: GameRenderComponentProps) => {
  let animFrame: null | number;
  function callback(t: number) {
    animFrame = requestAnimationFrame(callback)
    // custom render components into PIXI Container
    render(<GameDisplayComponent stateManager={props.stateManager} />, props.app.stage)
  }
  callback(0);
  return () => {
    if (animFrame != null) {
      cancelAnimationFrame(animFrame);
    }
  }
}

const GameRenderComponent = (props: GameRenderComponentProps) => {
  useEffect(() => {
    const cancel = loop(props)
    return () => {
      cancel();
    }
  })
  return <></>
}

export const GameView = (props: IProps) => {
  const size = useWindowSize();
  useDisableScroll();

  return (<Stage
    raf
    width={size.width}
    height={size.height}
    className="game-view"
  >
    <AppConsumer>
      {app => <>
        <GameRenderComponent app={app} stateManager={props.stateManager} />
      </>}
    </AppConsumer>
  </Stage>)
}
