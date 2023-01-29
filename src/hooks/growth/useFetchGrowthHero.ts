import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAdapter } from 'components';
import { processGrowthHero } from 'helpers';

import { growthHeroSelector } from 'redux/selectors';
import { setGrowthHero } from 'redux/slices/growthHero';

export const useFetchGrowthHero = () => {
  const dispatch = useDispatch();
  const { isFetched } = useSelector(growthHeroSelector);
  const { getGrowthWidget } = useAdapter();

  const fetchGrowthHero = () => {
    if (!isFetched) {
      getGrowthWidget('/hero').then(({ data, success }) => {
        if (data && success) {
          const processedGrowthHero = processGrowthHero(data);
          dispatch(
            setGrowthHero({
              ...processedGrowthHero,

              unprocessed: data,
              isFetched: success
            })
          );
        }
      });
    }
  };

  useEffect(fetchGrowthHero, []);
};
