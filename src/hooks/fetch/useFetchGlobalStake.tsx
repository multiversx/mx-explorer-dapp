import * as React from 'react';
import { useDispatch } from 'react-redux';

import { processGlobalStake } from 'helpers';
import { useAdapter } from 'hooks';
import { setGlobalStake } from 'redux/slices/globalStake';

export const useFetchGlobalStake = () => {
  const dispatch = useDispatch();

  const { getGlobalStake } = useAdapter();

  const fetchGlobalStake = () => {
    getGlobalStake().then(({ data, success }) => {
      if (data && success) {
        const processedGlobalStake = processGlobalStake(data);
        dispatch(
          setGlobalStake({
            ...processedGlobalStake,

            unprocessed: data,
            isFetched: true
          })
        );
      }
    });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(fetchGlobalStake, []);
};
