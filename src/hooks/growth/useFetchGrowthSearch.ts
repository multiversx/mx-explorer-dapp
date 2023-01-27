import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAdapter } from 'components';
import { processGrowthSearch } from 'helpers';

import { growthSearchSelector } from 'redux/selectors';
import { setGrowthSearch } from 'redux/slices/growthSearch';

export const useFetchGrowthSearch = () => {
  const dispatch = useDispatch();
  const { isFetched } = useSelector(growthSearchSelector);
  const { getGrowthWidget } = useAdapter();

  const fetchSearch = () => {
    if (!isFetched) {
      getGrowthWidget('/search').then(({ data, success }) => {
        if (data && success) {
          const processedGrowthSearch = processGrowthSearch(data);
          dispatch(
            setGrowthSearch({
              ...processedGrowthSearch,

              unprocessed: data,
              isFetched: success
            })
          );
        }
      });
    }
  };

  React.useEffect(fetchSearch, []);
};
