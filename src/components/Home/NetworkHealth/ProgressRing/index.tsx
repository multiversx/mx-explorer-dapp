import * as React from 'react';

export interface ProgressRingType {
  progress: number;
  radius?: number;
  stroke?: number;
}

const ProgressRing = ({ radius = 60, stroke = 3, progress }: ProgressRingType) => {
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="progress-ring w-100 h-100">
      <svg viewBox={`0 0 ${radius * 2} ${radius * 2}`}>
        <circle
          fill="none"
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
    </div>
  );
};

export default ProgressRing;
