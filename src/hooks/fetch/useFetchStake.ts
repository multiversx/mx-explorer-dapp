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
    const { data, success } = await getStakeOnce();

    if (data && success) {
      const hasValidatorData =
        data.auctionValidators !== undefined &&
        data.qualifiedAuctionValidators !== undefined;
      const processedData = {
        ...data,
        ...(hasValidatorData
          ? {
              notQualifiedAuctionValidators: new BigNumber(
                data.auctionValidators
              )
                .minus(data.qualifiedAuctionValidators)
                .toNumber()
            }
          : {})
      };

      const processedStake = processStake(processedData);
      dispatch(
        setStake({
          ...processedStake,

          unprocessed: processedData,
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
