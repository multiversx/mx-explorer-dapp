import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAdapter } from 'components';

import { growthMostUsedSelector } from 'redux/selectors';
import { setGrowthMostUsed } from 'redux/slices/growthMostUsed';

export const useFetchGrowthMostUsed = () => {
  const dispatch = useDispatch();
  const { isFetched } = useSelector(growthMostUsedSelector);
  const { getGrowthWidget } = useAdapter();

  const fetchMostUsed = () => {
    if (!isFetched) {
      getGrowthWidget('/most-used').then((growthMostUsed) => {
        if (growthMostUsed?.data && growthMostUsed.success) {
          dispatch(
            setGrowthMostUsed({
              ...growthMostUsed.data,

              isFetched: growthMostUsed.success
            })
          );
        }
      });
    }
  };

  React.useEffect(fetchMostUsed, []);
};