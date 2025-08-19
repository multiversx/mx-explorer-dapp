import { ELLIPSIS } from 'appConstants';
import { ProgressRing } from 'components';
import { useFetchEpochProgress } from 'hooks';
import { WithClassnameType } from 'types';

export const BlockProgressRing = ({ className }: WithClassnameType) => {
  const { isReady, roundProgress, roundTimeProgress } = useFetchEpochProgress();

  return (
    <div className={`block-progress-ring ${className ?? ''}`}>
      <ProgressRing
        progress={Number(roundProgress.toFixed(2))}
        size={100}
        isSubSecond={roundTimeProgress.isLessThan(1)}
        hasBg
      >
        <div className='label' data-testid='currentEpoch'>
          {isReady && roundTimeProgress ? `${roundTimeProgress}s` : ELLIPSIS}
        </div>
        <div className='description'>Round Time</div>
      </ProgressRing>
    </div>
  );
};
