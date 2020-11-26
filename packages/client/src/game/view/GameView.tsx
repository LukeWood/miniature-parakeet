import React, { useEffect, useState, useMemo, useCallback} from 'react';
import { StateManager, RenderState, GameRenderState, isLobbyRenderState } from '../state/StateManager';

import { useWindowSize, useDisableScroll } from '../../hooks';
import {LobbyStateView} from './LobbyView';

import {Controls} from '../controls';
import {IInputs} from '../controls/types';

import { Stage, useTick } from '@inlet/react-pixi';
import { Player } from './entities/player';

interface IProps {
  stateManager: StateManager;
}

interface GameDisplayComponentProps extends GameRenderState {}
function useForceUpdate() {
  const [, setTick] = useState(0);
  const update = useCallback(() => {
    setTick(tick => tick + 1);
  }, [])
  return update;
}
const GameDisplayComponent = (props: GameDisplayComponentProps) => {

  const forceRender = useForceUpdate();
  useTick(delta => {
    forceRender();
  })
  if (props === null) {
    return <></>
  }
  const playerSprites = [];
  for (let key in props.players) {
    playerSprites.push(<Player player={props.players[key]} key={key}/>);
  }
  return <>
    {playerSprites}
  </>
}

interface GamePlayComponentProps extends IProps {
  state: GameRenderState
}

const GamePlayComponent = (props: GamePlayComponentProps) => {
  const size = useWindowSize();
  useDisableScroll();

  const actionCallback = useMemo(() => (inputs: IInputs) => {
    props.stateManager.room?.send("input", inputs)
  }, [])

  return (
    <>
    <Controls actionCallback={actionCallback}/>
    <Stage
    raf
    width={size.width}
    height={size.height}
    className="game-view"
  >
    <GameDisplayComponent {...props.state} />
  </Stage>
  </>)
}

export const GameView = (props: IProps) => {

  const [state, setState] = useState<RenderState>(null)
  useEffect(() => {
    const sub = props.stateManager.state$.subscribe(s => {
      setState(s)
    })
    return () => {
      sub.unsubscribe();
    }
  })

  if (state == null) {
    return <div>Loading...</div>
  }


  if (isLobbyRenderState(state)) {
    return <LobbyStateView {...state}/>
  }

  return (<GamePlayComponent {...props} state={state}/>)
}
