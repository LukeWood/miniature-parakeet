import React from 'react';
import './button.scss';

interface IProps {
  onClick?: () => void
  text: string
};

export const Button = (props: IProps) => {
  return (<button onClick={props.onClick}>
    {props.text}
  </button>)
}
