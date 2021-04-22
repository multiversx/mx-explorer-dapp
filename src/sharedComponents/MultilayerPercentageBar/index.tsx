import { NodesVersionsType } from 'context/state';
import * as React from 'react';
import { Led, Trim } from 'sharedComponents';

export interface PercentageStepType extends NodesVersionsType {}

const MultilayerPercentageBar = ({
  steps,
  trim,
}: {
  steps: PercentageStepType[];
  trim?: boolean;
}) => {
  return (
    <div
      className={`d-flex h-100 flex-column multilayer-percentage-bar ${
        steps.length === 2 ? 'two-items' : ''
      }`}
    >
      <div className="progress w-100 my-0">
        {steps.map((step, i) => (
          <div
            key={`progress-bar-${i}`}
            className={`progress-bar step-${i + 1}`}
            style={{ width: step.percent + '%' }}
          />
        ))}
      </div>
      <div className={`d-flex legend-dot-container mt-2 ${trim ? '' : 'flex-wrap'}`}>
        {steps.map((step, i) => (
          <div
            key={`legend-${i}`}
            className={`legend-dot d-flex align-items-center ${trim ? '' : 'mr-1 mr-lg-3'}`}
          >
            <Led color={`flex-shrink-0 mr-1 step-${i + 1}`} />
            <small className="d-flex align-items-center overflow-hidden min-w-0">
              {trim ? <Trim text={step.name} /> : <>{step.name}</>}
              <span className="text-secondary ml-1">({step.percent}%)</span>
            </small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultilayerPercentageBar;
