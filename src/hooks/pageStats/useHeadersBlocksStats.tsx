import React, { useEffect, useState } from 'react';
import { useAdapter } from '../../components';

export type HeadersBlocksType = {
  blockHeight: number;
  totalApplicationsDeployed: number;
  totalNetworkFees: number;
  totalDeveloperRewards: number;
};

export const useHeadersBlocksStats = () => {
  const [headersBlocks, setHeadersBlocks] = useState<HeadersBlocksType[]>();

  const { getGrowthHeaders } = useAdapter();

  const getHeadersBlocks = async (): Promise<HeadersBlocksType[]> => {
    const result = await getGrowthHeaders('/blocks');

    if (!result.success) {
      setHeadersBlocks([]);
      return [];
    }

    setHeadersBlocks(result.data);
    return result.data;
  };

  useEffect(() => {
    getHeadersBlocks();
  }, []);

  return {
    title: 'Blocks',
    headersBlocks
  };
};
