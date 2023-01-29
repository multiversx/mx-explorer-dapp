import React, { useEffect } from 'react';
import { PieChart, Pie, Legend, Tooltip } from 'recharts';

import { Led, Trim } from 'components';
import { truncateMiddle } from 'helpers';
import { NodesVersionsType } from 'types';

export const prepareChartData = (steps: NodesVersionsType[]) => {
  return steps.map((step) => {
    return {
      name: truncateMiddle(step.name, 20),
      value: step.percent
    };
  });
};

export const MultilayerPercentageRing = ({
  steps,
  trim
}: {
  steps: NodesVersionsType[];
  trim?: boolean;
}) => {
  useEffect(() => {
    window.dispatchEvent(new Event('resize'));
  }, []);

  return (
    <div
      className={`d-flex flex-row flex-wrap align-items-center gap-2 multilayer-percentage-ring ${
        steps.length === 2 ? 'two-items' : ''
      }`}
    >
      <PieChart width={40} height={40} className='composed-pie-chart'>
        <Pie
          data={prepareChartData(steps)}
          dataKey='value'
          nameKey='name'
          cx='50%'
          cy='50%'
          innerRadius={10}
          outerRadius={20}
          stroke='none'
          startAngle={90}
          endAngle={-270}
        />
      </PieChart>

      <div
        className={`d-flex legend-dot-container d-flex flex-column  ${
          trim ? 'truncate-item-xl' : 'flex-wrap'
        }`}
      >
        {steps.map((step, i) => (
          <div
            key={`legend-${i}`}
            className={`legend-dot d-flex align-items-center ${
              trim ? '' : 'me-1 me-lg-3'
            }`}
          >
            <Led color={`flex-shrink-0 me-1 step-${i + 1}`} />
            <small className='d-flex align-items-center overflow-hidden min-w-0'>
              {trim ? <Trim text={step.name} /> : <>{step.name}</>}
              <span className='text-neutral-400 ms-1'>({step.percent}%)</span>
            </small>
          </div>
        ))}
      </div>
    </div>
  );
};
