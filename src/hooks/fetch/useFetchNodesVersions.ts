import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { processNodesVersions } from 'helpers';
import { useAdapter } from 'hooks';
import { nodesVersionsSelector } from 'redux/selectors';
import { setNodesVersions } from 'redux/slices/nodesVersions';

let currentRequest: any = null;

export const useFetchNodesVersions = () => {
  const dispatch = useDispatch();
  const { getNodesVersions } = useAdapter();
  const { isDataReady } = useSelector(nodesVersionsSelector);

  const getNodesVersionsOnce = () => {
    if (currentRequest) {
      return currentRequest;
    }

    const requestPromise = new Promise(async (resolve, reject) => {
      try {
        const response = await getNodesVersions();
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

  const fetchNodesVersions = async () => {
    const { data, success } = await getNodesVersionsOnce();

    if (data) {
      const processedNodesVersions = processNodesVersions(data);

      dispatch(
        setNodesVersions({
          ...processedNodesVersions,

          unprocessed: data,
          isDataReady: success
        })
      );
    }

    return { data, success };
  };

  useEffect(() => {
    if (!isDataReady) {
      fetchNodesVersions();
    }
  }, []);
};
