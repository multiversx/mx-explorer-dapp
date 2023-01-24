import * as React from 'react';

import { MetricType } from './helpers/types';

export const ChartMetrics = ({ metrics }: { metrics: MetricType[] }) => {
  return (
    <div className='chart-metrics ps-3'>
      {metrics.map((metric, metricIndex) => (
        <div key={`${metric.label}-${metric.value}`} className='metric'>
          <span className='text-neutral-400 small me-3'>{metric.label}:</span>
          <span>{metric.value}</span>
        </div>
      ))}
    </div>
  );
};
