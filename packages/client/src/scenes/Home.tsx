import React, { Component, ReactNode, useState } from 'react';
import { RouteComponentProps, navigate } from '@reach/router';
import { Link } from '@reach/router';
import { Box } from '../components/box';
import { Button } from '../components/button';
import {Space} from '../components/space';
import {Center} from '../components/center';
import {ColyseusService} from '../services/colyseus';

interface IProps extends RouteComponentProps {
  colyseus: ColyseusService
}

interface IState {
  chosenRoom: string;
}

const RoomOptions = (props: {}) => {
  const [room, setRoom] = useState("");
  return (<Box>
    <input
      value={room}
      type="text"
      onChange={v => setRoom(v.target.value)}
      ></input>
    <Button onClick={() => navigate("/play/"+room)} text="Random"></Button>
    <br/>
    <Button onClick={() => navigate("/play/random")} text="Random"></Button>
  </Box>)
}

export default class Game extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
  }

  render(): ReactNode {
    return <>
      <Center>
      <Box>
        <h1 style={{ textAlign: 'center' }}>Home</h1>
      </Box>
      <Space size='s'/>
      <RoomOptions/>
      </Center>
    </>
  }
}
