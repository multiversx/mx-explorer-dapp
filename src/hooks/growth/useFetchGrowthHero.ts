import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { processGrowthHero } from 'helpers';
import { useAdapter, useHasGrowthWidgets } from 'hooks';
import { growthHeroSelector } from 'redux/selectors';
import { setGrowthHero } from 'redux/slices/growthHero';

let currentRequest: any = null;

export const useFetchGrowthHero = () => {
  const hasGrowthWidgets = useHasGrowthWidgets();
  const dispatch = useDispatch();
  const { getGrowthWidget } = useAdapter();
  const { isDataReady } = useSelector(growthHeroSelector);

  const getGrowthHeroOnce = () => {
    if (currentRequest) {
      return currentRequest;
    }

    const requestPromise = new Promise(async (resolve, reject) => {
      try {
        const response = await getGrowthWidget('/hero');
        resolve(response);
      } catch (error) {
        reject(error);
      } finally {
        currentRequest = null;
      }
    });

    currentRequest = requestPromise;
    return requestPromise;
  };

  const fetchGrowthHero = async () => {
    const { data, success } = await getGrowthHeroOnce();

    if (data && success) {
      const processedGrowthHero = processGrowthHero(data);
      dispatch(
        setGrowthHero({
          ...processedGrowthHero,

          unprocessed: data,
          isDataReady: success
        })
      );
    }

    return { data, success };
  };

  useEffect(() => {
    if (!isDataReady && hasGrowthWidgets) {
      fetchGrowthHero();
    }
  }, [hasGrowthWidgets]);

  return fetchGrowthHero;
};
