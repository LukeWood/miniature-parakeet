import React from 'react';
import {navigate} from '@reach/router';

import { LobbyRenderState } from '../state/StateManager';
import {Button, Center, Box, Space, Line} from '../../components';
import Clipboard from 'react-clipboard.js';
import {show_success_banner} from '../../util/banner';

interface LobbyStateViewProps {
  state: LobbyRenderState;
}

interface shareArgs {
  title?: string;
  text?: string;
  url?: string
}
interface sharer {
  share?: (x: shareArgs) => void;
}

function inviteFriends() {
    (navigator as sharer).share!({
      title: "Come play me!",
      text: "You can use this link to join my lobby!",
      url: window.location.href
    });
}

const InviteButton = (_: {}) => {
  if ((navigator as sharer).share) {
    return <Button text={"Invite +"} onClick={inviteFriends}></Button>
  }

  return <Clipboard className="button" onSuccess={(_) => show_success_banner("Link copied to clipboard")} data-clipboard-text={window.location.href}>Copy Invite Code + </Clipboard>
}

interface listPlayer {
  name: string;
  key: string;
}
export const LobbyStateView = (props: LobbyStateViewProps) => {
  const state = props.state;

  const playerNames: listPlayer[] = [];
  for(let id in state.players) {
    playerNames.push({name: state.players[id].name, key: id})
  }
  const players = playerNames.map(player => {
    return (<p key={player.key}>{player.name}</p>)
  })

  const isHost = (state.sessionId in props.state.players) && props.state.players[props.state.sessionId].host
  return (
  <Center>
    <Space size='s'/>
    <Box>
    <h1>Lobby</h1>
    {isHost && <p>You're the host</p>}
    {isHost &&
      <Button text="Start +" onClick={() => state.room.send("start")}></Button>}
    {!isHost && <p>Waiting for host to start</p>}
    <Line/>
    {players}
    <InviteButton/>
    <Button text="Exit +" onClick={() => navigate("/")}></Button>
    </Box>
  </Center>)
}
