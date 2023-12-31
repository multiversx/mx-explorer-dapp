import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { processGrowthHero } from 'helpers';
import { useAdapter, useIsMainnet } from 'hooks';
import { growthHeroSelector } from 'redux/selectors';
import { setGrowthHero } from 'redux/slices/growthHero';

export const useFetchGrowthHero = () => {
  const isMainnet = useIsMainnet();
  const dispatch = useDispatch();
  const { isFetched } = useSelector(growthHeroSelector);
  const { getGrowthWidget } = useAdapter();

  const fetchGrowthHero = async (refesh?: boolean) => {
    if (!isFetched || refesh) {
      const { data, success } = await getGrowthWidget('/hero');

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

      return { data, success };
    }

    return { data: [], success: true };
  };

  useEffect(() => {
    if (isMainnet) {
      fetchGrowthHero();
    }
  }, [isMainnet]);

  return fetchGrowthHero;
};
