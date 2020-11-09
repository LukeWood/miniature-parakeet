import React, { Component, ReactNode } from 'react';
import { RouteComponentProps } from '@reach/router';

interface IProps extends RouteComponentProps {
}

interface IState { }

export default class Game extends Component<IProps, IState>{
  render(): ReactNode {
    return <>
      <h1>bulletz.io</h1>

    </>
  }
}
