import { Fragment, useEffect } from 'react';
import classNames from 'classnames';
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
      value: Number(step.value)
    };
  });
};

export const MultilayerPercentageRing = ({
  steps,
  hasTrim,
  className,
  legendClassName
}: MultilayerPercentageUIType) => {
  useEffect(() => {
    window.dispatchEvent(new Event('resize'));
  }, []);

  return (
    <div
      className={classNames(
        'd-flex flex-row flex-wrap align-items-center gap-2 multilayer-percentage-ring',
        { 'two-items': steps.length === 2 },
        className
      )}
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
        className={classNames(
          'legend-container',
          {
            'flex-column': hasTrim && !Boolean(legendClassName),
            'flex-row flex-wrap': !hasTrim && !Boolean(legendClassName),
            'd-flex truncate-item-xl': !Boolean(legendClassName)
          },
          legendClassName
        )}
      >
        {steps.map((step, i) => {
          if (step.legend) {
            return <Fragment key={`legend-${i}`}>{step.legend}</Fragment>;
          }
          return (
            <div
              key={`legend-${i}`}
              className={classNames('legend d-flex align-items-center', {
                'me-1 me-lg-2': !hasTrim
              })}
            >
              <Led color={`flex-shrink-0 me-1 step-${i + 1}`} />
              <small className='d-flex align-items-center overflow-hidden min-w-0'>
                {hasTrim ? <Trim text={String(step.name)} /> : <>{step.name}</>}
                <span className={`value ms-1 value-step-${i + 1}`}>
                  ({step.value}%)
                </span>
              </small>
            </div>
          );
        })}
      </div>
    </div>
  );
};
