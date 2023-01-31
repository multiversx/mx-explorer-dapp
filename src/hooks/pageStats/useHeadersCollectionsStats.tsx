import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  pageHeadersCollectionsSelector,
  pageHeadersStatsSelector
} from 'redux/selectors/pageHeadersStats';
import { setPageHeaderStats } from 'redux/slices/pageHeadersStats';
import { useAdapter } from '../../components';
import { HeadersCollectionsType } from '../../types/headerStats.types';

export const useHeadersCollectionsStats = () => {
  const pageHeaders = useSelector(pageHeadersStatsSelector);
  const headersCollections = useSelector(pageHeadersCollectionsSelector);

  const dispatch = useDispatch();
  const { getGrowthHeaders } = useAdapter();

  const getHeadersCollections = async (): Promise<HeadersCollectionsType> => {
    // if (headersCollections != null) {
    //   return headersCollections;
    // }

    const result = await getGrowthHeaders('/collections');

    if (!result.success) {
      // dispatch(setPageHeaderStats(pageHeaders));
      return {} as HeadersCollectionsType;
    }

    dispatch(
      setPageHeaderStats({
        ...pageHeaders,
        collections: result.data
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
