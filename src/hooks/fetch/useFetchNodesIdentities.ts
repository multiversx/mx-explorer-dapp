import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { IDENTITIES_FIELDS } from 'appConstants';
import { processNodesIdentities } from 'helpers';
import { useAdapter } from 'hooks';
import { nodesIdentitiesSelector } from 'redux/selectors';
import { setNodesIdentities } from 'redux/slices/nodesIdentities';

let currentRequest: any = null;

export const useFetchNodesIdentities = () => {
  const dispatch = useDispatch();
  const { getIdentities } = useAdapter();
  const { nodesIdentities } = useSelector(nodesIdentitiesSelector);

  const getNodesIdentitiesOnce = () => {
    if (currentRequest) {
      return currentRequest;
    }

    const requestPromise = new Promise(async (resolve, reject) => {
      try {
        const response = await getIdentities({
          fields: IDENTITIES_FIELDS.join(',')
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
    if (nodesIdentities.length === 0) {
      fetchNodesIdentities();
    }
  }, []);
};
