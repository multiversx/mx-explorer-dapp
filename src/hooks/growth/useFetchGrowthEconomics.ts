import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { processGrowthEconomics } from 'helpers';
import { useAdapter, useIsMainnet } from 'hooks';
import { growthEconomicsSelector } from 'redux/selectors';
import { setGrowthEconomics } from 'redux/slices/growthEconomics';

let currentRequest: any = null;

export const useFetchGrowthEconomics = () => {
  const isMainnet = useIsMainnet();
  const dispatch = useDispatch();
  const { getGrowthWidget } = useAdapter();
  const { isFetched } = useSelector(growthEconomicsSelector);

  const getGrowthEconomicsOnce = () => {
    if (currentRequest) {
      return currentRequest;
    }

    const requestPromise = new Promise(async (resolve, reject) => {
      try {
        const response = await getGrowthWidget('/economics');
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

  const fetchGrowthEconomics = async () => {
    const { data, success } = await getGrowthEconomicsOnce();

    if (data && success) {
      const processedGrowthEconomics = processGrowthEconomics(data);
      dispatch(
        setGrowthEconomics({
          ...processedGrowthEconomics,

          unprocessed: data,
          isFetched: success
        })
      );
    }

    return { data, success };
  };

  useEffect(() => {
    if (!isFetched && isMainnet) {
      fetchGrowthEconomics();
    }
  }, []);
};
