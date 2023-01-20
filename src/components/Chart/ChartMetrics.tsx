import * as React from 'react';

import { MetricType } from './helpers/types';

const ChartMetrics = ({ metrics }: { metrics: MetricType[] }) => {
  return (
    <div className="chart-metrics pl-3">
      {metrics.map((metric, metricIndex) => (
        <div key={`${metric.label}-${metric.value}`} className="metric">
          <span className="text-secondary small mr-3">{metric.label}:</span>
          <span>{metric.value}</span>
        </div>
      ))}
    </div>
  );
};

export default ChartMetrics;
