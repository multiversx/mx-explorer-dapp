import BigNumber from 'bignumber.js';

import { ELLIPSIS } from 'appConstants';
import { ProgressRing } from 'components';
import { useFetchEpochProgress } from 'hooks/useFetchEpochProgress';
import { WithClassnameType } from 'types';

export interface EpochRingType extends WithClassnameType {
  showTime?: boolean;
}

export const EpochProgressRing = ({
  showTime = true,
  className
}: EpochRingType) => {
  const { isReady, epoch, epochPercentage, epochTimeRemaining, roundsLeft } =
    useFetchEpochProgress();

  return (
    <div className={`epoch-progress-ring ${className ?? ''}`}>
      <ProgressRing progress={epochPercentage} size={140} hasBg>
        <div className='label' data-testid='currentEpoch'>
          {isReady && epoch ? (
            <>
              Epoch
              <br />
              {new BigNumber(epoch).toFormat(0)}
            </>
          ) : (
            ELLIPSIS
          )}
        </div>
        <div
          className='description'
          {...(showTime ? { title: epochTimeRemaining } : {})}
        >
          {roundsLeft && roundsLeft >= 0 ? (
            <>{new BigNumber(roundsLeft).toFormat(0)} Rounds Left</>
          ) : (
            ELLIPSIS
          )}
        </div>
      </ProgressRing>
    </div>
  );
};
