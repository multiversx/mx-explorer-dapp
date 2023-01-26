import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAdapter } from 'components';

import { growthMostUsedSelector } from 'redux/selectors';
import { setGrowthMostUsed } from 'redux/slices/growthMostUsed';

export const useFetchMostUsed = () => {
  const dispatch = useDispatch();
  const { growthMostUsedFetched } = useSelector(growthMostUsedSelector);
  const { getGrowthWidget } = useAdapter();

  const fetchGrowthMostUsed = () => {
    if (!growthMostUsedFetched) {
      getGrowthWidget('/most-used').then((growthMostUsed) => {
        if (growthMostUsed?.data && growthMostUsed.success) {
          dispatch(
            setGrowthMostUsed({
              ...growthMostUsed.data,
              growthMostUsedFetched: growthMostUsed.success
            })
          );
        }
      });
    }
  };

  React.useEffect(fetchGrowthMostUsed, []);
};
