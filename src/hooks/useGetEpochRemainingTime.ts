import { useEffect, useMemo, useRef, useState } from 'react';
import moment from 'moment';
import { useSelector } from 'react-redux';

import { useGetRemainingTime } from 'hooks';
import { statsSelector } from 'redux/selectors';

export const useGetEpochRemainingTime = () => {
  const {
    isDataReady: isStatsFetched,
    unprocessed: { epochTimeRemaining: unprocessedEpochTimeRemaining },
    stats
  } = useSelector(statsSelector);

  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const refreshTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );

  useEffect(() => {
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, []);

  const { epoch } = stats;

  const currentTimestamp = useMemo(
    () => moment().unix() + unprocessedEpochTimeRemaining / 1000,
    [refreshTrigger]
  );
  const remainingTime = useGetRemainingTime({
    timeData: currentTimestamp,
    onCountdownEnd: () => {
      refreshTimeoutRef.current = setTimeout(() => {
        setRefreshTrigger(moment().unix());
        return;
      }, 500);
    }
  });

  return { epoch, remainingTime, isStatsFetched };
};
