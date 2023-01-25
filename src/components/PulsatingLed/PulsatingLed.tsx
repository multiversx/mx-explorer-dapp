import * as React from 'react';
import { WithClassnameType } from 'types/withClassname.types';

export const PulsatingLed = ({ className }: WithClassnameType) => (
  <div className={`pulsating-led ${className}`}>
    <div className='ringring'></div>
    <div className='circle'></div>
  </div>
);
