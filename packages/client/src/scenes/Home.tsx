import React, { Component, ReactNode, useState } from 'react';
import { RouteComponentProps } from '@reach/router';
import { Link } from '@reach/router';
import { Box } from '../components/box';
import {ColyseusService} from '../services/colyseus';

interface IProps extends RouteComponentProps {
  colyseus: ColyseusService
}

type RoomsList = 'zero' | string[];
interface IState {
  roomsList: RoomsList
}

function renderRoomsList(roomsList: RoomsList) {
  if (roomsList == 'zero') {
    return (<p>Loading...</p>)
  }

  return roomsList.map(room => {
    return (<Link key={room} to={`/game/${room}`}><button>{room}</button></Link>)
  });
}

type Timeout = ReturnType<typeof setTimeout>;

export default class Game extends Component<IProps, IState> {
  state: IState = {
    roomsList: 'zero',
  }

  tref: Timeout;

  constructor(props: IProps) {
    super(props)
    this.refreshRooms();
    this.props.colyseus.client.joinOrCreate("game")
      .then(console.log)
    this.tref = setInterval(() => {
      this.refreshRooms();
    }, 200);
  }

  refreshRooms() {
    this.props.colyseus.client.getAvailableRooms('game')
      .then(rooms => {
        this.setState({roomsList: rooms.map(room => room.roomId)})
      })
  }

  render(): ReactNode {
    const roomsList = renderRoomsList(this.state.roomsList)
    return <>
      <Box>
        <h1 style={{ textAlign: 'center' }}>Home</h1>
        {roomsList}
      </Box>
    </>
  }
}
