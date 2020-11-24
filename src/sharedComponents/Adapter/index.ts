import { useGlobalState } from 'context';
import elasticAdapter from './elastic';
import apiAdapter from './api';
import * as f from './functions';
import { metaChainShardId } from 'appConfig';
import useAdapterConfig from './useAdapterConfig';

export default function useAdapter() {
  const {
    activeNetwork: { elasticUrl, adapter, proxyUrl: nodeUrl, apiUrl },
    timeout,
  } = useGlobalState();

  const providers = {
    api: {
      baseUrl: apiUrl || '',
      proxyUrl: apiUrl || '',
      ...apiAdapter,
    },
    elastic: {
      baseUrl: elasticUrl || '',
      proxyUrl: nodeUrl || '',
      ...elasticAdapter,
    },
  };

  const { proxyUrl, baseUrl } = providers[adapter];
  const { provider, getStats, getNodes, getRewards, getShards } = useAdapterConfig();

  return {
    /* Homepage */

    getStats: () => getStats(),

    // TODO: remove?
    getNetworkStatus: () => f.getNetworkStatus({ proxyUrl, timeout, metaChainShardId }),

    getLatestBlocks: () =>
      provider({
        url: `/blocks`,
        params: {
          size: 25,
          ...{
            fields: ['hash', 'nonce', 'shard', 'size', 'sizeTxs', 'timestamp', 'txCount'].join(','),
          },
        },
      }),
    getLatestTransactions: () =>
      provider({
        url: `/transactions`,
        params: {
          size: 25,
          ...{
            fields: [
              'txHash',
              'receiver',
              'receiverShard',
              'sender',
              'senderShard',
              'status',
              'timestamp',
              'value',
            ].join(','),
          },
        },
      }),

    /* Blocks */

    getBlock: async (blockId: string) => {
      try {
        const { data: block, success } = await provider({
          url: `/blocks/${blockId}`,
        });

        let nextHash;
        try {
          const { data } = await provider({
            url: `/blocks`,
            params: {
              nonce: block.nonce + 1,
              shard: block.shard,
            },
          });

          nextHash = data[0] ? data[0].hash : '';
        } catch {
          nextHash = '';
        }

        return {
          block,
          nextHash,
          success,
        };
      } catch {
        return { success: false };
      }
    },

    getBlocks: async ({ size = 1, shard, epochId, proposer }: f.GetBlocksType) => {
      try {
        const { data: blocks, success } = await provider({
          baseUrl,
          url: `/blocks`,
          params: {
            from: (size - 1) * 25,
            size: 25,
            ...(proposer ? { proposer } : {}),
            ...f.getShardOrEpochParam(shard, epochId),
            fields: ['hash', 'nonce', 'shard', 'size', 'sizeTxs', 'timestamp', 'txCount'].join(','),
          },
          timeout,
        });
        if (success) {
          return {
            data: f.processBlocks(blocks),
            success,
          };
        } else {
          return { success: false };
        }
      } catch (err) {
        return {
          success: false,
        };
      }
    },

    getBlocksCount: ({ shard, epochId }: f.GetBlocksType) =>
      provider({
        url: `/blocks/count`,
        params: f.getShardOrEpochParam(shard, epochId),
      }),

    /* Transaction */

    getTransaction: (transactionId: string) =>
      provider({
        url: `/transactions/${transactionId}`,
      }),

    /* Miniblocks */

    getMiniBlock: (miniBlockHash: string) =>
      provider({
        baseUrl,
        url: `/miniblocks/${miniBlockHash}`,
        timeout,
      }),

    getMiniBlockTransactions: ({ miniBlockHash, size }: { miniBlockHash: string; size: number }) =>
      provider({
        url: `/transactions`,
        params: {
          from: (size - 1) * 25,
          size: 25,
          miniBlockHash,
        },
      }),

    getMiniBlockTransactionsCount: ({ miniBlockHash }: { miniBlockHash: string }) =>
      provider({
        url: `/transactions/count`,
        params: {
          miniBlockHash,
        },
      }),

    /* Transactions */

    getTransactions: ({ size, address, senderShard, receiverShard }: f.TransactionsParamsType) =>
      provider({
        url: `/transactions`,
        params: f.getTransactionsParams({ size, address, senderShard, receiverShard }),
        timeout,
      }),

    getTransactionsCount: ({ address, senderShard, receiverShard }: f.TransactionsParamsType) =>
      provider({
        url: `/transactions/count`,
        params: {
          ...f.getAccountParams(address),
          ...(senderShard !== undefined ? { senderShard } : {}),
          ...(receiverShard !== undefined ? { receiverShard } : {}),
        },
        timeout,
      }),

    getRewards: (address: string) => getRewards(address),

    /* Validators */

    getShards: () => getShards(),

    getNodes: ({
      peerType,
      issues,
      search,
      nodeType,
      shard,
      status,
      size,
      identity,
      pagination = true,
      sort,
      order,
      count = false,
    }: f.GetNodesType) => {
      const asyncRequest = () =>
        getNodes({
          baseUrl,
          proxyUrl,
          url: `/nodes${count ? '/count' : ''}`,
          timeout,
          params: {
            ...(search !== undefined ? { search } : {}),
            ...(peerType !== undefined ? { peerType } : {}),
            ...(issues !== undefined ? { issues } : {}),
            ...(nodeType !== undefined ? { nodeType } : {}),
            ...(shard !== undefined ? { shard: parseInt(shard) } : {}),
            ...(status !== undefined ? { status } : {}),
            ...(identity !== undefined ? { identity } : {}),
            ...(sort !== undefined ? { sort } : {}),
            ...(order !== undefined ? { order } : {}),
            ...(size !== undefined
              ? pagination
                ? { from: (size - 1) * 25, size: 25 }
                : { size }
              : {}),
          },
        });
      return f.getNodes(asyncRequest);
    },

    getNodesCount: ({
      peerType,
      issues,
      search,
      nodeType,
      shard,
      status,
      identity,
      count = true,
    }: f.GetNodesType) => {
      const asyncRequest = () =>
        getNodes({
          baseUrl,
          proxyUrl,
          url: `/nodes${count ? '/count' : ''}`,
          timeout,
          params: {
            ...(search !== undefined ? { search } : {}),
            ...(peerType !== undefined ? { peerType } : {}),
            ...(issues !== undefined ? { issues } : {}),
            ...(nodeType !== undefined ? { nodeType } : {}),
            ...(shard !== undefined ? { shard: parseInt(shard) } : {}),
            ...(status !== undefined ? { status } : {}),
            ...(identity !== undefined ? { identity } : {}),
          },
        });
      return f.getNodes(asyncRequest);
    },

    getIdentities: () =>
      f.getIdentities({
        provider,
        baseUrl,
        timeout,
      }),

    getIdentity: (identity: string) =>
      f.getIdentity({
        provider,
        baseUrl,
        timeout,
        identity,
      }),

    getNode: (key: string) =>
      f.getNode({
        provider,
        baseUrl,
        timeout,
        key,
      }),

    getRounds: ({ validator }: f.GetRoundsType) =>
      f.getRounds({
        provider,
        baseUrl,
        validator,
        timeout,
      }),

    getAccount: (address: string) =>
      provider({
        url: `/accounts/${address}`,
      }),

    getAccounts: ({ size }: f.GetAccountsType) =>
      f.getAccounts({ provider, baseUrl, size, timeout }),

    getAccountsCount: ({ size }: f.GetAccountsType) =>
      f.getAccountsCount({ provider, baseUrl, size, timeout }),
  };
}
