import React, { useEffect, useState } from 'react';
import { useAdapter } from '../../components';

export type HeadersCollectionsType = {
  totalCollections: number;
  totalNFTsCreated: number;
  totalHolders: number;
  newNFTsInLast30d: number;
};

export const useHeadersCollectionsStats = () => {
  const [headersCollections, setHeadersCollections] =
    useState<HeadersCollectionsType[]>();

  const { getGrowthHeaders } = useAdapter();

  const getHeadersCollections = async (): Promise<HeadersCollectionsType[]> => {
    const result = await getGrowthHeaders('/collections');

    if (!result.success) {
      setHeadersCollections([]);
      return [];
    }

    setHeadersCollections(result.data);
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
