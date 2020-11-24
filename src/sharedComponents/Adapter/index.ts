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
  const { provider, getStats, getNodes } = useAdapterConfig();

  // TODO: adaptorul isi ia singur datele si nu e mix intre ele
  // TODO: dispare folderul functions {data, success} | {success: false}

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

    // getBlock: (blockId: string) => f.getBlock({ provider, baseUrl, blockId, proxyUrl, timeout }),
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
      f.getTransaction({ provider, baseUrl, transactionId, proxyUrl, timeout }),

    /* Miniblocks */

    getMiniBlock: (miniBlockHash: string) =>
      f.getMiniBlock({ provider, baseUrl, miniBlockHash, proxyUrl, timeout }),

    getMiniBlockTransactions: ({ miniBlockHash, size }: { miniBlockHash: string; size: number }) =>
      f.getMiniBlockTransactions({ provider, baseUrl, miniBlockHash, timeout, proxyUrl, size }),

    getMiniBlockTransactionsCount: ({ miniBlockHash }: { miniBlockHash: string }) =>
      f.getMiniBlockTransactionsCount({ provider, miniBlockHash, timeout, proxyUrl, baseUrl }),

    /* Transactions */

    getTransactions: ({ size, address, senderShard, receiverShard }: f.TransactionsType) =>
      f.getTransactions({
        provider,
        baseUrl,
        timeout,
        address,
        size,
        senderShard,
        receiverShard,
      }),

    getTransactionsCount: ({ size, address, senderShard, receiverShard }: f.TransactionsType) =>
      f.getTransactionsCount({
        provider,
        baseUrl,
        timeout,
        address,
        size,
        senderShard,
        receiverShard,
      }),

    getRewards: (address: string) => f.getRewards({ proxyUrl, timeout, address }),

    /* Validators */

    getShards: () =>
      f.getShards({
        provider,
        baseUrl,
        timeout,
      }),

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
    // getNodes: ({
    //   peerType,
    //   issues,
    //   search,
    //   nodeType,
    //   shard,
    //   status,
    //   size,
    //   identity,
    //   pagination,
    //   sort,
    //   order,
    // }: f.GetNodesType) =>
    //   f.getNodes({
    //     provider,
    //     baseUrl,
    //     timeout,
    //     peerType,
    //     issues,
    //     search,
    //     nodeType,
    //     shard,
    //     status,
    //     size,
    //     identity,
    //     pagination,
    //     sort,
    //     order,
    //   }),

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

    // getNodesCount: ({
    //   peerType,
    //   issues,
    //   search,
    //   nodeType,
    //   shard,
    //   status,
    //   identity,
    // }: f.GetNodesType) =>
    //   f.getNodes({
    //     provider,
    //     baseUrl,
    //     timeout,
    //     peerType,
    //     issues,
    //     search,
    //     nodeType,
    //     shard,
    //     status,
    //     identity,
    //     count: true,
    //   }),

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

    getAccount: (address: string) => f.getAccount({ proxyUrl, timeout, address }),

    getAccounts: ({ size }: f.GetAccountsType) =>
      f.getAccounts({ provider, baseUrl, size, timeout }),

    getAccountsCount: ({ size }: f.GetAccountsType) =>
      f.getAccountsCount({ provider, baseUrl, size, timeout }),
  };
}
