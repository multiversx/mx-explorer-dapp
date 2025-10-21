import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { processGrowthSearch } from 'helpers';
import { useHasGrowthWidgets } from 'hooks';
import { setGrowthSearch } from 'redux/slices';
import { useFetchGrowthWidgetOnce } from './useFetchGrowthWidgetOnce';

export const useFetchGrowthSearch = () => {
  const dispatch = useDispatch();
  const hasGrowthWidgets = useHasGrowthWidgets();
  const fetchGrowthWidgetOnce = useFetchGrowthWidgetOnce();

  const fetchGrowthSearch = async () => {
    const { data, success } = await fetchGrowthWidgetOnce('/search');

    if (data && success) {
      const processedGrowthSearch = processGrowthSearch(data);
      dispatch(
        setGrowthSearch({
          ...processedGrowthSearch,

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

    fetchGrowthSearch();
  }, [hasGrowthWidgets]);

  return fetchGrowthSearch;
};
