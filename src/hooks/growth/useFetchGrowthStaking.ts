import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { processGrowthStaking } from 'helpers';
import { useHasGrowthWidgets } from 'hooks';
import { setGrowthStaking } from 'redux/slices';
import { useFetchGrowthWidgetOnce } from './useFetchGrowthWidgetOnce';

export const useFetchGrowthStaking = () => {
  const dispatch = useDispatch();
  const hasGrowthWidgets = useHasGrowthWidgets();
  const fetchGrowthWidgetOnce = useFetchGrowthWidgetOnce();

  const fetchGrowthStaking = async () => {
    const { data, success } = await fetchGrowthWidgetOnce('/staking');

    if (data && success) {
      const processedGrowthStaking = processGrowthStaking(data);
      const { totalStaked7d, totalStaked30d, totalStakedAll, ...rest } = data;

      dispatch(
        setGrowthStaking({
          ...processedGrowthStaking,

          totalStaked7d: data.totalStaked7d,
          totalStaked30d: data.totalStaked30d,
          totalStakedAll: data.totalStakedAll,

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

    fetchGrowthStaking();
  }, [hasGrowthWidgets]);

  return fetchGrowthStaking;
};
