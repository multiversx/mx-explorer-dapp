import { useMemo, useState } from 'react';
import moment from 'moment';
import { useSelector } from 'react-redux';

import { useGetRemainingTime } from 'hooks';
import { statsSelector } from 'redux/selectors';

export const useGetEpochRemainingTime = () => {
  const {
    isFetched: isStatsFetched,
    unprocessed: { epochTimeRemaining: unprocessedEpochTimeRemaining },
    epoch
  } = useSelector(statsSelector);

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const currentTimestamp = useMemo(
    () => moment().unix() + unprocessedEpochTimeRemaining / 1000,
    [refreshTrigger]
  );
  const remainingTime = useGetRemainingTime({
    timeData: currentTimestamp,
    onCountdownEnd: () => {
      setTimeout(() => {
        setRefreshTrigger(moment().unix());
        return;
      }, 500);
    }
  });

  return { epoch, remainingTime, isStatsFetched };
};
