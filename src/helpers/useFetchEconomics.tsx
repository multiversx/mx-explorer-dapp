import * as React from 'react';
import { useDispatch } from 'react-redux';
import { useAdapter } from 'components';
import { processEconomics } from 'helpers';

import { setEconomics } from 'redux/slices/economics';

export const useFetchEconomics = () => {
  const dispatch = useDispatch();

  const { getEconomics } = useAdapter();

  const fetchEconomics = () => {
    getEconomics().then((economics) => {
      if (economics?.data && economics.success) {
        const processedEconomics = processEconomics(economics.data);
        dispatch(
          setEconomics({
            ...processedEconomics
          })
        );
      }
    });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(fetchEconomics, []);
};
