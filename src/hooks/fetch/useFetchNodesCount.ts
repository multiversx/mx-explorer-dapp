import { useEffect } from 'react';
import BigNumber from 'bignumber.js';
import { useDispatch } from 'react-redux';

import { useAdapter } from 'hooks';
import { setStakeExtra } from 'redux/slices/stakeExtra';

let currentRequest: any = null;

// TODO: temporary - not in /stake API
export const useFetchNodesCount = () => {
  const dispatch = useDispatch();
  const { getNodesCount } = useAdapter();

  const getNodesCountOnce = () => {
    if (currentRequest) {
      return currentRequest;
    }

    const requestPromise = new Promise(async (resolve, reject) => {
      try {
        const response = await Promise.all([
          getNodesCount(),
          getNodesCount({ type: 'validator' })
        ]);
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

  const fetchNodesCount = async () => {
    const [totalNodes, totalValidatorNodes] = await getNodesCountOnce();

    if (
      totalNodes?.data &&
      totalValidatorNodes?.success &&
      totalValidatorNodes?.data &&
      totalValidatorNodes?.success
    ) {
      const unprocessedData = {
        totalNodes: totalNodes.data,
        totalValidatorNodes: totalValidatorNodes.data
      };

      const processedTotalNodes = new BigNumber(totalNodes.totalNodes).toFormat(
        0
      );
      const processedTotalValidatorNodes = new BigNumber(
        totalValidatorNodes.data
      ).toFormat(0);

      dispatch(
        setStakeExtra({
          totalNodes: processedTotalNodes,
          totalValidatorNodes: processedTotalValidatorNodes,

          unprocessed: unprocessedData,
          isFetched: true
        })
      );
    }
  };

  useEffect(() => {
    fetchNodesCount();
  }, []);
};
