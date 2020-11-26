import React from 'react';
import { Sprite } from '@inlet/react-pixi';
import {IPlayer} from '../../state/types';

interface IProps {
  key: string;
  player: IPlayer;
}

export const Player = (props: IProps) => {
  return <Sprite width={500} height={500} image={'https://s3-us-west-2.amazonaws.com/s.cdpn.io/693612/IaUrttj.png'} x={props.player.x} y={props.player.y} />
}
