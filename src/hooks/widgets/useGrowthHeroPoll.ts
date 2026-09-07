import { useEffect } from 'react';

import { LONG_POOLING_REFRESH_RATE } from 'appConstants';
import { useFetchGrowthHero, useHasGrowthWidgets } from 'hooks';

let subscriberCount = 0;
let intervalId: ReturnType<typeof setInterval> | null = null;

export const useGrowthHeroPoll = () => {
  const hasGrowthWidgets = useHasGrowthWidgets();
  const fetchHero = useFetchGrowthHero();

  useEffect(() => {
    if (!hasGrowthWidgets) {
      return;
    }

    subscriberCount += 1;
    if (intervalId === null) {
      intervalId = setInterval(() => {
        if (!document.hidden) {
          fetchHero();
        }
      }, LONG_POOLING_REFRESH_RATE);
    }

    return () => {
      subscriberCount -= 1;
      if (subscriberCount <= 0 && intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
        subscriberCount = 0;
      }
    };
  }, [hasGrowthWidgets]);
};
