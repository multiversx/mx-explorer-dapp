import classNames from 'classnames';
import { Overlay } from 'components';

import { WithClassnameType } from 'types';

export interface PercentageBarUIType extends WithClassnameType {
  overallPercent: number;
  overallPercentLabel?: string;
  fillPercent: number;
  fillPercentLabel?: string;
  type?: string;
}

export const PercentageBar = ({
  overallPercent,
  overallPercentLabel = '',
  fillPercent,
  fillPercentLabel = '',
  type,
  className
}: PercentageBarUIType) => (
  <div
    className={classNames(
      'd-flex h-100 align-items-center percentage-bar',
      className,
      {
        small: type === 'small'
      }
    )}
  >
    {overallPercent + fillPercent > 0 ? (
      <div className='progress progress-sm w-100 my-2'>
        {overallPercentLabel ? (
          <Overlay
            title={overallPercentLabel}
            className='progress-bar existing'
            style={{ width: overallPercent + '%' }}
          />
        ) : (
          <div
            className='progress-bar existing'
            style={{ width: overallPercent + '%' }}
          />
        )}
        {fillPercentLabel ? (
          <Overlay
            title={fillPercentLabel}
            className='progress-bar new'
            style={{ width: fillPercent + '%' }}
          />
        ) : (
          <div
            className='progress-bar new'
            style={{ width: fillPercent + '%' }}
          />
        )}
      </div>
    ) : (
      <div className='progress progress-sm w-100 my-2'>
        <div className='progress-bar existing' />
      </div>
    )}
  </div>
);
