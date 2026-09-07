import { memo } from 'react';

import { ELLIPSIS, POOLING_REFRESH_RATE_LIMIT } from 'appConstants';
import { ProgressRing, SweepRing } from 'components';
import { useEpochProgress, useRoundDuration, useRoundTicker } from 'hooks';
import { WithClassnameType } from 'types';

const RING_SIZE = 100;

const formatRoundSeconds = (elapsedMs: number) =>
  elapsedMs % 1000 === 0
    ? String(elapsedMs / 1000)
    : (elapsedMs / 1000).toFixed(1);

const RoundTimeLabel = memo(() => {
  const { elapsedMs } = useRoundTicker();

  return <>{`${formatRoundSeconds(elapsedMs)}s`}</>;
});

const SteppedRoundRing = ({ isReady }: { isReady: boolean }) => {
  const { elapsedMs, roundMs, stepMs } = useRoundTicker();
  const progress = Number(((elapsedMs * 100) / roundMs).toFixed(2));

  return (
    <ProgressRing
      progress={progress}
      size={RING_SIZE}
      noTransition={elapsedMs <= stepMs}
      hasBg
    >
      <div className='label' data-testid='currentEpoch'>
        {isReady ? `${formatRoundSeconds(elapsedMs)}s` : ELLIPSIS}
      </div>
      <div className='description'>Round Time</div>
    </ProgressRing>
  );
};

export const BlockProgressRing = ({ className }: WithClassnameType) => {
  const { isReady } = useEpochProgress();
  const roundDuration = useRoundDuration();

  const isSubSecond =
    Boolean(roundDuration) && roundDuration < POOLING_REFRESH_RATE_LIMIT;

  return (
    <div className={`block-progress-ring ${className ?? ''}`}>
      {isSubSecond ? (
        <SweepRing durationMs={roundDuration} size={RING_SIZE} hasBg>
          <div className='label' data-testid='currentEpoch'>
            {isReady ? <RoundTimeLabel /> : ELLIPSIS}
          </div>
          <div className='description'>Round Time</div>
        </SweepRing>
      ) : (
        <SteppedRoundRing isReady={Boolean(isReady)} />
      )}
    </div>
  );
};
