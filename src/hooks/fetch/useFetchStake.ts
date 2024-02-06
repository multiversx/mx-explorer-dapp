import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { processStake } from 'helpers';
import { useAdapter } from 'hooks';
import { setStake } from 'redux/slices/stake';

let currentRequest: any = null;

export const useFetchStake = () => {
  const dispatch = useDispatch();
  const { getStake } = useAdapter();

  const getStakeOnce = () => {
    if (currentRequest) {
      return currentRequest;
    }

    const requestPromise = new Promise(async (resolve, reject) => {
      try {
        const response = await getStake();
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

  const fetchStake = async () => {
    const { data: fetchData, success } = await getStakeOnce();

    // TODO - Temporary Hardcoded
    const data = {
      ...fetchData,
      nakamotoCoefficient: fetchData.nakamotoCoefficient ?? 5, // nakamotoCoefficient (calculated as top x identities by validators to reach > 33.3%)
      minimumAuctionTopup:
        fetchData.nakamotoCoefficient ?? '1743213300000000000000', // minimumAuctionTopup (moved from /economics)
      minimumAuctionStake:
        fetchData.minimumAuctionStake ?? '4243213300000000000000', // minimumAuctionStake (2500 + minimumAuctionTopup)
      dangerZoneValidators:
        fetchData.dangerZoneValidators ?? fetchData.activeValidators - 1800,
      eligibleValidators:
        fetchData.eligibleValidators ?? fetchData.activeValidators,
      notEligibleValidators: fetchData.notEligibleValidators ?? 1800
    };

    if (data && success) {
      const processedStake = processStake(data);
      dispatch(
        setStake({
          ...processedStake,

          unprocessed: data,
          isFetched: true
        })
      );
    }

    return { data, success };
  };

  useEffect(() => {
    fetchStake();
  }, []);
};
