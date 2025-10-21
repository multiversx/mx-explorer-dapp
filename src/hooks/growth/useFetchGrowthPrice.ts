import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { processGrowthPrice } from 'helpers';
import { useHasGrowthWidgets } from 'hooks';
import { setGrowthPrice } from 'redux/slices';
import { useFetchGrowthWidgetOnce } from './useFetchGrowthWidgetOnce';

export const useFetchGrowthPrice = () => {
  const dispatch = useDispatch();
  const hasGrowthWidgets = useHasGrowthWidgets();
  const fetchGrowthWidgetOnce = useFetchGrowthWidgetOnce();

  const fetchGrowthPrice = async () => {
    const { data, success } = await fetchGrowthWidgetOnce('/price');

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

    return { data, success };
  };

  useEffect(() => {
    if (!hasGrowthWidgets) {
      return;
    }

    fetchGrowthPrice();
  }, [hasGrowthWidgets]);

  return fetchGrowthPrice;
};
