import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { processGrowthEconomics } from 'helpers';
import { useAdapter } from 'hooks';
import { growthEconomicsSelector } from 'redux/selectors';
import { setGrowthEconomics } from 'redux/slices/growthEconomics';

export const useFetchGrowthEconomics = () => {
  const dispatch = useDispatch();
  const { isFetched } = useSelector(growthEconomicsSelector);
  const { getGrowthWidget } = useAdapter();

  const fetchGrowthEconomics = () => {
    if (!isFetched) {
      getGrowthWidget('/economics').then(({ data, success }) => {
        if (data && success) {
          const processedGrowthEconomics = processGrowthEconomics(data);

          dispatch(
            setGrowthEconomics({
              ...processedGrowthEconomics,

              unprocessed: data,
              isFetched: success
            })
          );
        }
      });
    }
  };

  useEffect(fetchGrowthEconomics, []);
};
