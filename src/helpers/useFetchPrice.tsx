import * as React from 'react';
import { useGlobalDispatch } from 'context';
import { adapter } from 'sharedComponents';

export default function useFetchPrice() {
  const dispatch = useGlobalDispatch();
  const { getEconomics } = adapter();

  const fetchPrice = () => {
    getEconomics().then((getEconomics) => {
      const usd = getEconomics.success ? getEconomics.data.price : undefined;

      dispatch({
        type: 'setUsd',
        usd,
      });
    });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(fetchPrice, []);
}
