import React from 'react';
import { useDispatch } from 'react-redux';

import { processEconomics } from 'helpers';
import { useAdapter } from 'hooks';
import { setEconomics } from 'redux/slices/economics';

let currentRequest: any = null;

export const useFetchEconomics = () => {
  const dispatch = useDispatch();
  const { getEconomics } = useAdapter();

  const getEconomicsOnce = () => {
    if (currentRequest) {
      return currentRequest;
    }

    const requestPromise = new Promise(async (resolve, reject) => {
      try {
        const response = await getEconomics();
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

  const fetchEconomics = async () => {
    const { data, success } = await getEconomicsOnce();

    if (data && success) {
      const processedEconomics = processEconomics(data);
      dispatch(
        setEconomics({
          ...processedEconomics,

          unprocessed: data,
          isFetched: true
        })
      );
    }

    return { data, success };
  };

  return fetchEconomics;
};
