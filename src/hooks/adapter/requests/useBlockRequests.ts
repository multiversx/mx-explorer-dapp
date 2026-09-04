import { useMemo } from 'react';

import { LATEST_BLOCKS_FIELDS } from 'appConstants';
import { AxiosParamsApiType, GetBlocksType } from 'types/adapter.types';

import { getBlocksParams } from '../helpers';
import { useAdapterConfig } from '../useAdapterConfig';

export const useBlockRequests = () => {
  const { provider } = useAdapterConfig();

  return useMemo(
    () => ({
      /* Blocks */

      getLatestBlocks: ({ size = 5, signal, timeout }: GetBlocksType) =>
        provider({
          url: '/blocks',
          signal,
          timeout,
          params: {
            size,
            fields: LATEST_BLOCKS_FIELDS.join(',')
          }
        }),

      getBlock: (
        blockId: string,
        { signal, timeout }: AxiosParamsApiType = {}
      ) => provider({ url: `/blocks/${blockId}`, signal, timeout }),

      getBlocks: ({ signal, timeout, ...params }: GetBlocksType) =>
        provider({
          url: '/blocks',
          signal,
          timeout,
          params: getBlocksParams(params)
        }),

      getBlocksCount: ({ signal, timeout, ...params }: GetBlocksType = {}) =>
        provider({
          url: '/blocks/c',
          signal,
          timeout,
          params: getBlocksParams({ isCount: true, ...params })
        }),

      /* Miniblocks */

      getMiniBlock: (
        miniBlockHash: string,
        { signal, timeout }: AxiosParamsApiType = {}
      ) => provider({ url: `/miniblocks/${miniBlockHash}`, signal, timeout })
    }),
    [provider]
  );
};
