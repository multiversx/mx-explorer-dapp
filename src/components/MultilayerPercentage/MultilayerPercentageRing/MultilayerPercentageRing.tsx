import { useEffect } from 'react';
import { PieChart, Pie } from 'recharts';

import { Led, Trim } from 'components';
import { truncateMiddle } from 'helpers';
import {
  MultilayerPercentageUIType,
  MultilayerPercentageStepType
} from '../types';

export const prepareChartData = (steps: MultilayerPercentageStepType[]) => {
  return steps.map((step) => {
    return {
      name: truncateMiddle(String(step.name), 20),
      value: step.value
    };
  });
};

export const MultilayerPercentageRing = ({
  steps,
  hasTrim
}: MultilayerPercentageUIType) => {
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
          data={hasTrim ? prepareChartData(steps) : steps}
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
        className={`d-flex legend-dot-container d-flex truncate-item-xl ${
          hasTrim ? 'flex-column' : 'flex-row flex-wrap'
        }`}
      >
        {steps.map((step, i) => (
          <div
            key={`legend-${i}`}
            className={`legend-dot d-flex align-items-center ${
              hasTrim ? '' : 'me-1 me-lg-2'
            }`}
          >
            <Led color={`flex-shrink-0 me-1 step-${i + 1}`} />
            <small className='d-flex align-items-center overflow-hidden min-w-0'>
              {hasTrim ? <Trim text={String(step.name)} /> : <>{step.name}</>}
              <span className={`percentage ms-1 percentage-step-${i + 1}`}>
                ({step.value}%)
              </span>
            </small>
          </div>
        ))}
      </div>
    </div>
  );
};
