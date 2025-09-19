import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { processGrowthEconomics } from 'helpers';
import { useAdapter, useHasGrowthWidgets } from 'hooks';
import { growthEconomicsSelector } from 'redux/selectors';
import { setGrowthEconomics } from 'redux/slices/growthEconomics';

let currentRequest: any = null;

export const useFetchGrowthEconomics = () => {
  const hasGrowthWidgets = useHasGrowthWidgets();
  const dispatch = useDispatch();
  const { getGrowthWidget } = useAdapter();
  const { isDataReady } = useSelector(growthEconomicsSelector);

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
          isDataReady: success
        })
      );
    }

    return { data, success };
  };

  useEffect(() => {
    if (!isDataReady && hasGrowthWidgets) {
      fetchGrowthEconomics();
    }
  }, []);
};
