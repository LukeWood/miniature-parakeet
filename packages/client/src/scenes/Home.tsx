import React, { Component, ReactNode } from 'react';
import { RouteComponentProps } from '@reach/router';
import { Link } from '@reach/router';
import { Box } from '../components/box';

interface IProps extends RouteComponentProps {
}

interface IState { }

export default class Game extends Component<IProps, IState>{
  render(): ReactNode {
    return <>
      <Box>
        <h1 style={{ textAlign: 'center' }}>Home</h1>
        <Link to="/game/123"><button>123</button></Link>
      </Box>
    </>
  }
}
