import * as React from 'react';

export interface ProgressRingType {
  radius: number;
  stroke: number;
  progress: number;
  dotted?: number;
}

const ProgressRing = (props: ProgressRingType) => {
  const { radius, stroke, progress, dotted } = props;

  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = `-${circumference - (progress / 100) * circumference}`;

  return (
    <div className="progress-ring w-100 h-100">
      <svg viewBox={`0 0 ${radius * 2} ${radius * 2}`}>
        <circle
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        {dotted && (
          <circle
            className="dotted-circle"
            fill="transparent"
            strokeWidth={stroke + 0.5}
            strokeDasharray={dotted + ' ' + dotted * 5}
            style={{ strokeDashoffset: 0 }}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        )}
      </svg>
    </div>
  );
};

export default ProgressRing;
