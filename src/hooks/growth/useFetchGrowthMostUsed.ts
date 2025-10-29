import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { useHasGrowthWidgets } from 'hooks';
import { setGrowthMostUsed } from 'redux/slices';
import { useFetchGrowthWidgetOnce } from './useFetchGrowthWidgetOnce';

export const useFetchGrowthMostUsed = () => {
  const dispatch = useDispatch();
  const hasGrowthWidgets = useHasGrowthWidgets();
  const fetchGrowthWidgetOnce = useFetchGrowthWidgetOnce();

  const fetchGrowthMostUsed = async () => {
    const { data, success } = await fetchGrowthWidgetOnce(
      '/verified-most-used'
    );

    if (data && success) {
      dispatch(
        setGrowthMostUsed({
          ...data,
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

    fetchGrowthMostUsed();
  }, [hasGrowthWidgets]);

  return fetchGrowthMostUsed;
};
