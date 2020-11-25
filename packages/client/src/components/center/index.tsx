import React, {FunctionComponent} from 'react';
import './centerer.scss';

interface IProps {};

export const Center: FunctionComponent<IProps> = ({children}) => {
  return <div className="centerer">
    <div>
    {children}
    </div>
  </div>
}
