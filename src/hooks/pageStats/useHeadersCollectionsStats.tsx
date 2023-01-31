import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAdapter } from '../../components';
import { pageHeadersCollectionsStatsSelector } from '../../redux/selectors/pageHeadersCollectionsStats';
import { setPageHeaderCollectionsStats } from '../../redux/slices/pageHeadersCollectionsStats';
import { HeadersCollectionsType } from '../../types/headerStats.types';

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

    dispatch(setPageHeaderCollectionsStats(result.data));

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
