import React, { useEffect } from 'react';
import BigNumber from 'bignumber.js';
import { useDispatch, useSelector } from 'react-redux';

import { useAdapter } from 'hooks';
import { pageHeadersCollectionsStatsSelector } from 'redux/selectors/pageHeadersCollectionsStats';
import { setPageHeaderCollectionsStats } from 'redux/slices/pageHeadersCollectionsStats';
import { HeadersCollectionsType } from 'types/headerStats.types';

export const useHeadersCollectionsStats = () => {
  const headersCollections = useSelector(pageHeadersCollectionsStatsSelector);

  const dispatch = useDispatch();
  const { getGrowthHeaders } = useAdapter();

  const getHeadersCollections = async (): Promise<HeadersCollectionsType> => {
    if (Object.keys(headersCollections).length !== 0) {
      return headersCollections;
    }

    const result = await getGrowthHeaders('/collections');

    if (!result.success) {
      return {} as HeadersCollectionsType;
    }

    dispatch(
      setPageHeaderCollectionsStats({
        newNFTsInLast30d: new BigNumber(result.data.newNFTsInLast30d).toFormat(
          0
        ),
        totalNFTsCreated: new BigNumber(result.data.totalNFTsCreated).toFormat(
          0
        ),
        totalCollections: new BigNumber(result.data.totalCollections).toFormat(
          0
        ),
        totalHolders: new BigNumber(result.data.totalHolders).toFormat(0)
      })
    );

    return result.data;
  };

  useEffect(() => {
    getHeadersCollections();
  }, []);

  return {
    title: 'Collections',
    headersCollections
  };
};
