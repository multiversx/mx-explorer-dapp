import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { IDENTITIES_FIELDS } from 'appConstants';
import { processNodesIdentities } from 'helpers';
import { useAdapter } from 'hooks';
import { setNodesIdentities } from 'redux/slices/nodesIdentities';
import { SortableApiType } from 'types';

let currentRequest: any = null;

export const useFetchNodesIdentities = (sortParams?: SortableApiType) => {
  const dispatch = useDispatch();
  const { getIdentities } = useAdapter();
  const { sort, order } = sortParams ?? {};

  const getNodesIdentitiesOnce = () => {
    if (currentRequest) {
      return currentRequest;
    }

    const requestPromise = new Promise(async (resolve, reject) => {
      try {
        const response = await getIdentities({
          fields: IDENTITIES_FIELDS.join(','),
          sort,
          order
        });
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

  const fetchNodesIdentities = async () => {
    const { data, success } = await getNodesIdentitiesOnce();

    if (data) {
      const processedNodesIdentities = processNodesIdentities(data);
      dispatch(
        setNodesIdentities({
          nodesIdentities: processedNodesIdentities,
          unprocessed: data,
          isFetched: success
        })
      );
    }

    return { data, success };
  };

  useEffect(() => {
    fetchNodesIdentities();
  }, []);
};
