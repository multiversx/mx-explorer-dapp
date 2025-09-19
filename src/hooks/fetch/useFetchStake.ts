import { useEffect } from 'react';
import BigNumber from 'bignumber.js';
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
    const stake = await getStakeOnce();

    if (stake?.data && stake?.success) {
      const hasValidatorData =
        stake.data.auctionValidators !== undefined &&
        stake.data.qualifiedAuctionValidators !== undefined;
      const processedData = {
        ...stake.data,
        ...(hasValidatorData
          ? {
              notQualifiedAuctionValidators: new BigNumber(
                stake.data.auctionValidators
              )
                .minus(stake.data.qualifiedAuctionValidators)
                .toNumber()
            }
          : {})
      };

      const processedStake = processStake(processedData);
      dispatch(
        setStake({
          ...processedStake,

          unprocessed: processedData,
          isDataReady: true
        })
      );
    }

    return { data: stake.data, success: stake.success };
  };

  useEffect(() => {
    fetchStake();
  }, []);
};
