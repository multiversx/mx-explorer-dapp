import classNames from 'classnames';

import { ProgressRing } from 'components';
import { formatBigNumber } from 'helpers';
import { useFetchEpochProgress } from 'hooks';
import { WithClassnameType } from 'types';

export const EpochHeroPill = ({ className }: WithClassnameType) => {
  const { epoch, epochPercentage, epochTimeRemaining, roundsLeft } =
    useFetchEpochProgress();

  return (
    <div
      className={classNames(
        'hero-pill epoch-hero-pill d-flex align-items-center justify-content-between font-headings',
        className
      )}
    >
      <div className='d-flex flex-column lext-left me-3'>
        <div className='label' data-testid='currentEpoch'>
          Epoch {formatBigNumber({ value: epoch, showEllipsisIfZero: true })}
        </div>
        <div className='description cursor-context' title={epochTimeRemaining}>
          {formatBigNumber({ value: roundsLeft, showEllipsisIfZero: true })}{' '}
          Rounds Left
        </div>
      </div>
      <ProgressRing progress={epochPercentage} size={32} />
    </div>
  );
};
