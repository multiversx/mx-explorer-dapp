import React from 'react';
import BigNumber from 'bignumber.js';

import { ELLIPSIS } from 'appConstants';
import { ProgressRing } from 'components';
import { useFetchEpochProgress } from 'hooks/useFetchEpochProgress';
import { WithClassnameType } from 'types';

export const EpochHeroPill = ({ className }: WithClassnameType) => {
  const { isReady, epoch, epochPercentage, epochTimeRemaining, roundsLeft } =
    useFetchEpochProgress();

  return (
    <div
      className={`hero-pill epoch-hero-pill d-flex align-items-center justify-content-between font-primary-medium ${
        className ?? ''
      }`}
    >
      <div className='d-flex flex-column lext-left me-3'>
        <div className='label' data-testid='currentEpoch'>
          {isReady && epoch ? <>Epoch {epoch}</> : ELLIPSIS}
        </div>
        <div className='description cursor-context' title={epochTimeRemaining}>
          {roundsLeft && roundsLeft >= 0 ? (
            <>{new BigNumber(roundsLeft).toFormat(0)} Rounds Left</>
          ) : (
            ELLIPSIS
          )}
        </div>
      </div>
      <ProgressRing progress={epochPercentage} size={32} />
    </div>
  );
};
