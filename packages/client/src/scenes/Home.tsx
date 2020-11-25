import React, { Component, ReactNode, useState, useEffect } from 'react';
import { RouteComponentProps, navigate } from '@reach/router';
import { Box, Button } from '../components';
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
    <Button onClick={() => navigate("/play/"+room)} text="Join +"></Button>
    <Button onClick={() => navigate("/play/random")} text="Random + "></Button>
  </Box>)
}

const CharacterCustomization = () => {
  const [name, setName] = useState(localStorage.getItem("name") || "");

  useEffect(() => localStorage.setItem("name", name), [name]);

  return (<Box>
    <input
      value={name}
      placeholder="Name"
      type="text"
      onChange={v => setName(v.target.value)}
      ></input>
  </Box>)
}

export default class Game extends Component<IProps, IState> {
  render(): ReactNode {
    return <>
      <Center>
      <Space size='s'/>
      <Box>
        <h1 style={{ textAlign: 'center' }}>Home</h1>
      </Box>

      <Space size='s'/>
      <CharacterCustomization/>

      <Space size='s'/>
      <RoomOptions/>
      </Center>
    </>
  }
}
