import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { processGrowthHero } from 'helpers';
import { useAdapter, useIsMainnet } from 'hooks';
import { growthHeroSelector } from 'redux/selectors';
import { setGrowthHero } from 'redux/slices/growthHero';

let currentRequest: any = null;

export const useFetchGrowthHero = () => {
  const isMainnet = useIsMainnet();
  const dispatch = useDispatch();
  const { getGrowthWidget } = useAdapter();
  const { isFetched } = useSelector(growthHeroSelector);

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
          isFetched: success
        })
      );
    }

    return { data, success };
  };

  useEffect(() => {
    if (!isFetched && isMainnet) {
      fetchGrowthHero();
    }
  }, [isMainnet]);

  return fetchGrowthHero;
};
