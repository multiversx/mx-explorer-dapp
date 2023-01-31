import React, { useEffect, useState } from 'react';
import { useAdapter } from '../../components';

export type HeadersTokensType = {
  ecosystemMarketCap: number;
  totalTokens: number;
  newTokensInLast30d: number;
  tokenTransfersInLast30d: number;
};

export const useHeadersTokensStats = () => {
  const [headersTokens, setHeadersTokens] = useState<HeadersTokensType[]>();

  const { getGrowthHeaders } = useAdapter();

  const getHeadersTokens = async (): Promise<HeadersTokensType[]> => {
    const result = await getGrowthHeaders('/tokens');

    if (!result.success) {
      setHeadersTokens([]);
      return [];
    }

    setHeadersTokens(result.data);
    return result.data;
  };

  useEffect(() => {
    getHeadersTokens();
  }, []);

  return {
    title: 'Tokens',
    headersTokens
  };
};
