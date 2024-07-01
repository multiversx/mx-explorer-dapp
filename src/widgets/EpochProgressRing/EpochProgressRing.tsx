import { useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
import classNames from 'classnames';

import { ELLIPSIS } from 'appConstants';
import { ProgressRing } from 'components';
import { useFetchEpochProgress } from 'hooks';
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

  const [displayRoundsLeft, setDisplayRoundsLeft] = useState<number>();
  useEffect(() => {
    if (isReady) {
      setDisplayRoundsLeft((existingRound) => {
        if (roundsLeft && typeof roundsLeft === 'number') {
          if (!existingRound) {
            return roundsLeft;
          }
          if (existingRound) {
            if (existingRound === roundsLeft && roundsLeft > 0) {
              return roundsLeft - 1;
            }
            if (roundsLeft < existingRound) {
              return roundsLeft;
            }
            if (existingRound - roundsLeft < -4) {
              return roundsLeft;
            }
          }
        }

        return existingRound;
      });
    }
  }, [isReady, roundsLeft]);

  return (
    <div className={`epoch-progress-ring ${className ?? ''}`}>
      <ProgressRing progress={epochPercentage} size={140} hasBg>
        <div className='label' data-testid='currentEpoch'>
          {isReady && epoch !== undefined ? (
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
          className={classNames('description', { 'cursor-context': showTime })}
          {...(showTime ? { title: epochTimeRemaining } : {})}
        >
          {displayRoundsLeft && displayRoundsLeft >= 0 ? (
            <>{new BigNumber(displayRoundsLeft).toFormat(0)} Rounds Left</>
          ) : (
            ELLIPSIS
          )}
        </div>
      </ProgressRing>
    </div>
  );
};
