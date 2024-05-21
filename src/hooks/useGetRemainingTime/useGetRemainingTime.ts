import { useCallback, useEffect, useState } from 'react';
import moment from 'moment';

import { formatTimeUntilTimestamp, TimeGroupType } from 'helpers';
import { UseGetRemainingTimePropsType } from './useGetRemainingTime.types';

export const useGetRemainingTime = ({
  timeData: timestamp,
  excludeTimeGroup,
  showZeroDecimal,
  onCountdownEnd
}: UseGetRemainingTimePropsType): TimeGroupType[] => {
  const timeExpired = timestamp === 0 ? false : timestamp < moment().unix();
  const [time, setTime] = useState<TimeGroupType[]>(
    formatTimeUntilTimestamp({
      timestamp,
      excludeTimeGroup,
      showZeroDecimal
    })
  );

  const initializeAsyncTimer = useCallback(() => {
    if (timestamp > 0) {
      setTime(
        formatTimeUntilTimestamp({
          timestamp,
          excludeTimeGroup,
          showZeroDecimal
        })
      );
    }
  }, [timestamp]);

  const updateTimer = useCallback(() => {
    if (timestamp === 0) {
      return;
    }

    const interval = setInterval(() => {
      setTime(
        formatTimeUntilTimestamp({
          timestamp,
          excludeTimeGroup,
          showZeroDecimal
        })
      );
    }, 1000);

    if (timeExpired) {
      clearInterval(interval);

      if (onCountdownEnd) {
        onCountdownEnd();
      }
    }

    return () => {
      clearInterval(interval);
    };
  }, [time, timestamp, timeExpired]);

  useEffect(updateTimer, [updateTimer]);
  useEffect(initializeAsyncTimer, [initializeAsyncTimer]);

  return time;
};
