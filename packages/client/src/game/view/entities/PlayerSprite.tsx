import React from 'react';
import {Sprite} from '@inlet/react-pixi';
import {Player} from '../../state/StateManager';

interface PlayerSpriteProps {
  player: Player
}

export const PlayerSprite = (props: PlayerSpriteProps) => {
  return <Sprite image={props.player.sprite} x={props.player.x} y={props.player.y} />
}
