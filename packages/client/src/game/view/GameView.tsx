import React, { useEffect, useState } from 'react';
import { StateManager, RenderState, GameRenderState, LobbyRenderState, isLobbyRenderState } from '../state/StateManager';

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

interface LobbyStateViewProps {
  state: LobbyRenderState;
}

const LobbyStateView = (props: LobbyStateViewProps) => {
  const state = props.state;

  const playerNames: string[] = [];
  for(let id in state.players) {
    playerNames.push(state.players[id].name)
  }
  const players = playerNames.map(name => {
    return (<p key={name}>{name}</p>)
  })

  const isHost = (state.sessionId in props.state.players) && props.state.players[props.state.sessionId].host
  return <div>
    <h1>Lobby</h1>
    {players}
    {isHost &&
      <button onClick={() => state.room.send("start")}>Start</button>}
  </div>
}

export const GameView = (props: IProps) => {
  const size = useWindowSize();
  useDisableScroll();

  const [state, setState] = useState<RenderState>(null)
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
