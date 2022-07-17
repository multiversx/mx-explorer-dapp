import * as React from 'react';
import { processEconomics } from 'helpers';
import { useGlobalDispatch } from 'context';
import { adapter } from 'sharedComponents';

export default function useFetchEconomics() {
  const dispatch = useGlobalDispatch();

  const { getEconomics } = adapter();

  const fetchEconomics = () => {
    getEconomics().then((economics) => {
      if (economics.success && economics.data.price) {
        dispatch({
          type: 'setUsd',
          usd: economics.data.price,
        });
      }
      const newEconomics = processEconomics(economics);
      dispatch({
        type: 'setEconomics',
        economics: newEconomics,
      });
    });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(fetchEconomics, []);
}
