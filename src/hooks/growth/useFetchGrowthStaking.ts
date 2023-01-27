import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAdapter } from 'components';
import { processGrowthStaking } from 'helpers';

import { growthStakingSelector } from 'redux/selectors';
import { setGrowthStaking } from 'redux/slices/growthStaking';

export const useFetchGrowthStaking = () => {
  const dispatch = useDispatch();
  const { isFetched } = useSelector(growthStakingSelector);
  const { getGrowthWidget } = useAdapter();

  const fetchStaking = () => {
    if (!isFetched) {
      getGrowthWidget('/staking').then(({ data, success }) => {
        if (data && success) {
          const processedGrowthStaking = processGrowthStaking(data);
          dispatch(
            setGrowthStaking({
              ...processedGrowthStaking,

              totalStaked30d: data.totalStaked30d,
              totalStakedAll: data.totalStakedAll,

              unprocessed: data,
              isFetched: success
            })
          );
        }
      });
    }
  };

  React.useEffect(fetchStaking, []);
};
