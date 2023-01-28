import React from 'react';
import { WithClassnameType } from 'types';

export interface ProgressRingType extends WithClassnameType {
  size: number;
  progress: number;
  trackWidth: number;
  indicatorWidth: number;
}

export const ProgressRing = ({
  size = 24,
  progress = 0,
  trackWidth = 3,
  indicatorWidth = 3,
  className
}: ProgressRingType) => {
  const center = size / 2;
  const radius =
    center - (trackWidth > indicatorWidth ? trackWidth : indicatorWidth);

  const dashArray = 2 * Math.PI * radius;
  const dashOffset = dashArray * ((100 - progress) / 100);

  return (
    <svg
      className={`progress-ring ${className ?? ''}`}
      style={{ width: size, height: size, minWidth: size, minHeight: size }}
    >
      <circle
        className='track'
        cx={center}
        cy={center}
        fill='transparent'
        r={radius}
        stroke='rgba(0,0,0,0.2)'
        strokeWidth={trackWidth}
      />
      <circle
        className='fill'
        cx={center}
        cy={center}
        fill='transparent'
        r={radius}
        stroke='rgba(0,0,0,0.4)'
        strokeWidth={indicatorWidth}
        strokeDasharray={dashArray}
        strokeDashoffset={dashOffset}
        strokeLinecap='round'
      />
    </svg>
  );
};
