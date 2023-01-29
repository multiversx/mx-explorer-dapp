import React from 'react';
import { WithClassnameType } from 'types';

export interface ProgressRingType extends WithClassnameType {
  progress: number;
  size?: number;
  trackWidth?: number;
  indicatorWidth?: number;
  hasBg?: boolean;
  children?: React.ReactNode;
}

export const ProgressRing = ({
  progress = 0,
  size = 24,
  trackWidth = 3,
  indicatorWidth = 3,
  hasBg = false,
  children,
  className
}: ProgressRingType) => {
  const center = size / 2;
  const radius =
    center - (trackWidth > indicatorWidth ? trackWidth : indicatorWidth);

  const dashArray = 2 * Math.PI * radius;
  const dashOffset = dashArray * ((100 - progress) / 100);

  const showLabel = size > 80 && children;

  return (
    <div
      className={`progress-ring-wrapper ${className ?? ''} ${
        hasBg ? 'has-bg' : ''
      }`}
      style={{ width: size, height: size }}
    >
      <svg
        className={`progress-ring progress-${progress}`}
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

      {showLabel && <div className='progress-ring-label'>{children}</div>}
    </div>
  );
};
