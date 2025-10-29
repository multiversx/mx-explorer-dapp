import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { processGrowthEconomics } from 'helpers';
import { useHasGrowthWidgets } from 'hooks';
import { setGrowthEconomics } from 'redux/slices';
import { useFetchGrowthWidgetOnce } from './useFetchGrowthWidgetOnce';

export const useFetchGrowthEconomics = () => {
  const dispatch = useDispatch();
  const hasGrowthWidgets = useHasGrowthWidgets();
  const fetchGrowthWidgetOnce = useFetchGrowthWidgetOnce();

  const fetchGrowthEconomics = async () => {
    const { data, success } = await fetchGrowthWidgetOnce('/economics');

    if (data && success) {
      const processedGrowthEconomics = processGrowthEconomics(data);
      dispatch(
        setGrowthEconomics({
          ...processedGrowthEconomics,

          unprocessed: data,
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

    fetchGrowthEconomics();
  }, [hasGrowthWidgets]);

  return fetchGrowthEconomics;
};
