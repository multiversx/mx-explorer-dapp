import classNames from 'classnames';

import { ProgressRing } from 'components';
import { formatBigNumber, getStringPlural } from 'helpers';
import { useFetchEpochProgress } from 'hooks';
import { WithClassnameType } from 'types';

export interface EpochRingType extends WithClassnameType {
  showTime?: boolean;
}

export const EpochProgressRing = ({
  showTime = true,
  className
}: EpochRingType) => {
  const { epoch, epochPercentage, epochTimeRemaining, roundsLeft, isReady } =
    useFetchEpochProgress();

  return (
    <div className={classNames('epoch-progress-ring', className)}>
      <ProgressRing progress={epochPercentage} size={140} hasBg>
        <div className='label' data-testid='currentEpoch'>
          Epoch
          <br />
          {formatBigNumber({ value: epoch, showEllipsisIfZero: !isReady })}
        </div>
        <div
          className={classNames('description', { 'cursor-context': showTime })}
          {...(showTime ? { title: epochTimeRemaining } : {})}
        >
          {formatBigNumber({ value: roundsLeft, showEllipsisIfZero: !isReady })}{' '}
          {getStringPlural(roundsLeft, {
            string: 'Round'
          })}{' '}
          Left
        </div>
      </ProgressRing>
    </div>
  );
};
