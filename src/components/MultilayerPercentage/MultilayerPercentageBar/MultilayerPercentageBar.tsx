import { Led, Trim } from 'components';
import { MultilayerPercentageUIType } from '../types';

export const MultilayerPercentageBar = ({
  steps,
  hasTrim
}: MultilayerPercentageUIType) => {
  return (
    <div
      className={`d-flex h-100 flex-column multilayer-percentage-bar ${
        steps.length === 2 ? 'two-items' : ''
      }`}
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
        className={`d-flex legend-dot-container mt-2 ${
          hasTrim ? '' : 'flex-wrap'
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
              <span className='text-neutral-400 ms-1'>({step.value}%)</span>
            </small>
          </div>
        ))}
      </div>
    </div>
  );
};
