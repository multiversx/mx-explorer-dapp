import { useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';

import { ELLIPSIS } from 'appConstants';
import { ProgressRing } from 'components';
import { useFetchEpochProgress } from 'hooks';
import { WithClassnameType } from 'types';

export const EpochHeroPill = ({ className }: WithClassnameType) => {
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
    <div
      className={`hero-pill epoch-hero-pill d-flex align-items-center justify-content-between font-headings ${
        className ?? ''
      }`}
    >
      <div className='d-flex flex-column lext-left me-3'>
        <div className='label' data-testid='currentEpoch'>
          {isReady && epoch !== undefined ? (
            <>Epoch {new BigNumber(epoch).toFormat(0)}</>
          ) : (
            ELLIPSIS
          )}
        </div>
        <div className='description cursor-context' title={epochTimeRemaining}>
          {displayRoundsLeft && displayRoundsLeft >= 0 ? (
            <>{new BigNumber(displayRoundsLeft).toFormat(0)} Rounds Left</>
          ) : (
            ELLIPSIS
          )}
        </div>
      </div>
      <ProgressRing progress={epochPercentage} size={32} />
    </div>
  );
};
