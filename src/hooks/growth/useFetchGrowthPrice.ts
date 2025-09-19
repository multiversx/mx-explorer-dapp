import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { processGrowthPrice } from 'helpers';
import { useAdapter, useHasGrowthWidgets } from 'hooks';
import { growthPriceSelector } from 'redux/selectors';
import { setGrowthPrice } from 'redux/slices/growthPrice';

export const useFetchGrowthPrice = () => {
  const hasGrowthWidgets = useHasGrowthWidgets();
  const dispatch = useDispatch();
  const { isDataReady } = useSelector(growthPriceSelector);
  const { getGrowthWidget } = useAdapter();

  const fetchGrowthPrice = () => {
    if (!isDataReady) {
      getGrowthWidget('/price').then(({ data, success }) => {
        if (data && success) {
          const processedGrowthPrice = processGrowthPrice(data);
          const { price7d, price30d, priceAll, ...rest } = data;
          dispatch(
            setGrowthPrice({
              ...processedGrowthPrice,

              price7d: data.price7d,
              price30d: data.price30d,
              priceAll: data.priceAll,

              unprocessed: rest,
              isDataReady: success
            })
          );
        }
      });
    }
  };

  useEffect(() => {
    if (hasGrowthWidgets) {
      fetchGrowthPrice();
    }
  }, [hasGrowthWidgets]);
};
