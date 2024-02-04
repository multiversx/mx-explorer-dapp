import { Fragment } from 'react';
import classNames from 'classnames';

import { Led, Trim } from 'components';
import { MultilayerPercentageUIType } from '../types';

export const MultilayerPercentageBar = ({
  steps,
  hasTrim,
  className
}: MultilayerPercentageUIType) => {
  return (
    <div
      className={classNames(
        'd-flex h-100 flex-column multilayer-percentage-bar',
        { 'two-items': steps.length === 2 },
        className
      )}
    >
      <div className='progress w-100 my-0'>
        {steps.map((step, i) => (
          <div
            key={`progress-bar-${i}`}
            className={`progress-bar step-${i + 1}`}
            style={{ width: step.value + '%' }}
          />
        ))}
      </div>
      <div
        className={classNames('d-flex legend-container mt-2', {
          'flex-wrap': !hasTrim
        })}
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
                <span className='text-neutral-400 ms-1'>({step.value}%)</span>
              </small>
            </div>
          );
        })}
      </div>
    </div>
  );
};
