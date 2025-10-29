import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { processNodesOverview } from 'helpers';
import { useAdapter } from 'hooks';
import { getInitialNodesOverviewState, setNodesOverview } from 'redux/slices';
import { GetNodesType } from 'types';

let currentRequest: any = null;

export const useFetchNodesOverview = (config: GetNodesType) => {
  const dispatch = useDispatch();
  const { getNodes } = useAdapter();

  const getNodesOverviewOnce = () => {
    if (currentRequest) {
      return currentRequest;
    }

    const requestPromise = new Promise(async (resolve, reject) => {
      try {
        const response = await getNodes(config);
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

  const fetchNodesOverview = async () => {
    const { data, success } = await getNodesOverviewOnce();

    if (data) {
      const processedNodesOverview = processNodesOverview(data);

      dispatch(
        setNodesOverview({
          nodes: processedNodesOverview,
          isDataReady: success
        })
      );
    }

    return { data, success };
  };

  useEffect(() => {
    dispatch(setNodesOverview(getInitialNodesOverviewState()));
    fetchNodesOverview();
  }, []);
};
