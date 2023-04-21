import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { processEconomics } from 'helpers';
import { useAdapter } from 'hooks';
import { setEconomics } from 'redux/slices/economics';

export const useFetchEconomics = () => {
  const dispatch = useDispatch();

  const { getEconomics } = useAdapter();

  const fetchEconomics = () => {
    getEconomics().then(({ data, success }) => {
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
    });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(fetchEconomics, []);
};
