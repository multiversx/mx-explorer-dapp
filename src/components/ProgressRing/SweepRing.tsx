import { memo } from 'react';
import classNames from 'classnames';

import { WithClassnameType } from 'types';

export interface SweepRingType extends WithClassnameType {
  durationMs: number;
  size?: number;
  trackWidth?: number;
  indicatorWidth?: number;
  hasBg?: boolean;
  children?: React.ReactNode;
}

const SweepRingBase = ({
  durationMs,
  size = 24,
  trackWidth = 3,
  indicatorWidth = 3,
  hasBg = false,
  children,
  className
}: SweepRingType) => {
  const center = size / 2;
  const radius = center - Math.max(trackWidth, indicatorWidth);

  const showLabel = size > 80 && children;

  return (
    <div
      className={classNames(
        'progress-ring-wrapper',
        'sweep-ring',
        { 'has-bg': hasBg },
        className
      )}
      style={
        {
          width: size,
          height: size,
          '--sweep-duration': `${durationMs}ms`
        } as React.CSSProperties
      }
    >
      <svg
        className='progress-ring'
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
          pathLength={100}
          strokeDasharray={100}
          strokeDashoffset={100}
          strokeLinecap='round'
        />
      </svg>

      {showLabel && <div className='progress-ring-label'>{children}</div>}
    </div>
  );
};

export const SweepRing = memo(SweepRingBase);
