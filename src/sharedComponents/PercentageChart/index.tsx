import * as React from 'react';

const PercentageChart = ({ percentage }: { percentage: string }) => {
  return (
    <div className="percentage-chart mr-1" data-percentage={parseInt(percentage)}>
      <svg viewBox="0 0 32 32" width="16" height="16">
        <circle r="16" cx="16" cy="16" />
      </svg>
    </div>
  );
};

export default PercentageChart;
