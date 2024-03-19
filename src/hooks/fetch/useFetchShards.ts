import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useAdapter } from 'hooks';
import { interfaceSelector } from 'redux/selectors';
import { setShards } from 'redux/slices/interface';

let currentRequest: any = null;

export const useFetchShards = () => {
  const dispatch = useDispatch();
  const { getShards } = useAdapter();
  const { shards } = useSelector(interfaceSelector);

  const getShardsOnce = () => {
    if (currentRequest) {
      return currentRequest;
    }

    const requestPromise = new Promise(async (resolve, reject) => {
      try {
        const response = await getShards();
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

  const fetchShards = async () => {
    const { data, success } = await getShardsOnce();

    if (data && success) {
      dispatch(setShards(data));
    }

    return { data, success };
  };

  useEffect(() => {
    if (shards.length === 0) {
      fetchShards();
    }
  }, []);
};
