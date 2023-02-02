import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { processGrowthStaking } from 'helpers';
import { useAdapter } from 'hooks';
import { growthStakingSelector } from 'redux/selectors';
import { setGrowthStaking } from 'redux/slices/growthStaking';

export const useFetchGrowthStaking = () => {
  const dispatch = useDispatch();
  const { isFetched } = useSelector(growthStakingSelector);
  const { getGrowthWidget } = useAdapter();

  const fetchGrowthStaking = () => {
    if (!isFetched) {
      getGrowthWidget('/staking').then(({ data, success }) => {
        if (data && success) {
          const processedGrowthStaking = processGrowthStaking(data);
          const { totalStaked7d, totalStaked30d, totalStakedAll, ...rest } =
            data;

          dispatch(
            setGrowthStaking({
              ...processedGrowthStaking,

              totalStaked7d: data.totalStaked7d,
              totalStaked30d: data.totalStaked30d,
              totalStakedAll: data.totalStakedAll,

              unprocessed: rest,
              isFetched: success
            })
          );
        }
      });
    }
  };

  useEffect(fetchGrowthStaking, []);
};
