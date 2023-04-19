import React from 'react';

export const PercentageLed = ({ percentage }: { percentage: string }) => {
  return (
    <div className='percentage-led me-1' data-percentage={parseInt(percentage)}>
      <svg viewBox='0 0 32 32' width='16' height='16'>
        <circle r='16' cx='16' cy='16' />
      </svg>
    </div>
  );
};
