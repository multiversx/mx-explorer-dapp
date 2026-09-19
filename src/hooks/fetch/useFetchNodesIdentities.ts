import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { IDENTITIES_FIELDS } from 'appConstants';
import { processNodesIdentities } from 'helpers';
import { useAdapter } from 'hooks';
import { setNodesIdentities } from 'redux/slices';
import { SortableApiType } from 'types';

import { createSingleFlight } from './helpers';

const singleFlight = createSingleFlight<any>();

export const useFetchNodesIdentities = (sortParams?: SortableApiType) => {
  const dispatch = useDispatch();
  const { getIdentities } = useAdapter();
  const { sort, order } = sortParams ?? {};

  const getNodesIdentitiesOnce = () =>
    singleFlight(`${sort}_${order}`, () =>
      getIdentities({
        fields: IDENTITIES_FIELDS.join(','),
        sort,
        order
      })
    );

  const fetchNodesIdentities = async () => {
    const { data, success } = await getNodesIdentitiesOnce();

    if (data) {
      const processedNodesIdentities = processNodesIdentities(data);
      dispatch(
        setNodesIdentities({
          nodesIdentities: processedNodesIdentities,
          unprocessed: data,
          isDataReady: success
        })
      );
    }

    return { data, success };
  };

  useEffect(() => {
    fetchNodesIdentities();
  }, [sort, order]);
};
