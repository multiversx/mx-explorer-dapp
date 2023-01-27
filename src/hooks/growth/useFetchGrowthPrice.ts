import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAdapter } from 'components';
import { processGrowthPrice } from 'helpers';

import { growthPriceSelector } from 'redux/selectors';
import { setGrowthPrice } from 'redux/slices/growthPrice';

export const useFetchGrowthPrice = () => {
  const dispatch = useDispatch();
  const { isFetched } = useSelector(growthPriceSelector);
  const { getGrowthWidget } = useAdapter();

  const fetchPrice = () => {
    if (!isFetched) {
      getGrowthWidget('/price').then(({ data, success }) => {
        if (data && success) {
          const processedGrowthPrice = processGrowthPrice(data);
          dispatch(
            setGrowthPrice({
              ...processedGrowthPrice,

              price7d: data.price7d,
              price30d: data.price30d,
              priceAll: data.priceAll,

              unprocessed: data,
              isFetched: success
            })
          );
        }
      });
    }
  };

  React.useEffect(fetchPrice, []);
};
