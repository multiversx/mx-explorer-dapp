import * as React from 'react';
import { useGlobalDispatch } from 'context';
import { adapter } from 'sharedComponents';

export default function useFetchPrice() {
  const dispatch = useGlobalDispatch();
  const { getEgldPrice } = adapter();

  const fetchPrice = () => {
    getEgldPrice().then((priceData) => {
      const usd = priceData.success ? priceData.data : undefined;

      dispatch({
        type: 'setUsd',
        usd,
      });
    });
  };

  React.useEffect(fetchPrice, []);
}
