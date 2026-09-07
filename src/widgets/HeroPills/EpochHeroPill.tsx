import classNames from 'classnames';

import { ProgressRing } from 'components';
import { formatBigNumber, getStringPlural } from 'helpers';
import { useEpochProgress } from 'hooks';
import { WithClassnameType } from 'types';

export const EpochHeroPill = ({ className }: WithClassnameType) => {
  const { epoch, epochPercentage, epochTimeRemaining, roundsLeft, isReady } =
    useEpochProgress();

  return (
    <div
      className={classNames(
        'hero-pill epoch-hero-pill d-flex align-items-center justify-content-between font-headings',
        className
      )}
    >
      <div className='d-flex flex-column lext-left me-3'>
        <div className='label' data-testid='currentEpoch'>
          Epoch{' '}
          {formatBigNumber({ value: epoch, showEllipsisIfZero: !isReady })}
        </div>
        <div className='description cursor-context' title={epochTimeRemaining}>
          {formatBigNumber({ value: roundsLeft, showEllipsisIfZero: !isReady })}{' '}
          {getStringPlural(roundsLeft, {
            string: 'Round'
          })}{' '}
          Left
        </div>
      </div>
      <ProgressRing progress={Number(epochPercentage.toFixed(2))} size={32} />
    </div>
  );
};
