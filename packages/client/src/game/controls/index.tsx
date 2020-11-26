import React, {useEffect, useState} from 'react';
import {IInputs} from './types';

interface ControlProps {
    actionCallback: (p: IInputs) => void
}

const controlsDown: {[key: string]: object} = {
  "w": {up: true},
  "a": {left: true},
  "s": {down: true},
  "d": {right: true}
}

const controlsUp: {[key: string]: object} = {
  "w": {up: false},
  "a": {left: false},
  "s": {down: false},
  "d": {right: false}
}

let activeControls = {
  left: false,
  up: false,
  right: false,
  down: false,
  shoot: false,
  autoshoot: false
};

export const Controls = (props: ControlProps) => {
  const updateAndSend = (change: object) => {
    const updated =  Object.assign({}, activeControls, change);
    props.actionCallback(updated)
    activeControls = updated;
  }

  useEffect(() => {
    const keydown = (e: KeyboardEvent) => {
      const change = controlsDown[e.key.toLowerCase()] || {};
      updateAndSend(change);
    }
    const keyup = (e: KeyboardEvent) => {
      const change = controlsUp[e.key.toLowerCase()] || {};
      updateAndSend(change);
    }
    window.addEventListener("keydown", keydown)
    window.addEventListener("keyup", keyup)
    return () => {
      window.removeEventListener("keydown", keydown)
      window.removeEventListener("keyup", keyup)
    }
  }, [props.actionCallback])

  useEffect(
    () => {
      props.actionCallback(activeControls)
    },
    [activeControls]
  )

  // TODO(lukewood): Mobile controls
  return <></>
}
