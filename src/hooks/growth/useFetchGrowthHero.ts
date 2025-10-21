import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { processGrowthHero } from 'helpers';
import { useHasGrowthWidgets } from 'hooks';
import { setGrowthHero } from 'redux/slices';
import { useFetchGrowthWidgetOnce } from './useFetchGrowthWidgetOnce';

export const useFetchGrowthHero = () => {
  const dispatch = useDispatch();
  const hasGrowthWidgets = useHasGrowthWidgets();
  const fetchGrowthWidgetOnce = useFetchGrowthWidgetOnce();

  const fetchGrowthHero = async () => {
    const { data, success } = await fetchGrowthWidgetOnce('/hero');

    if (data && success) {
      const processedGrowthHero = processGrowthHero(data);
      dispatch(
        setGrowthHero({
          ...processedGrowthHero,

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

    fetchGrowthHero();
  }, [hasGrowthWidgets]);

  return fetchGrowthHero;
};
