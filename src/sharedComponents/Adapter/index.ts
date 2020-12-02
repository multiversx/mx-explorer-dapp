import * as helpers from './helpers';
import useAdapterConfig from './useAdapterConfig';

export default function useAdapter() {
  const { provider, getStats, getNodes, getRewards, getShards } = useAdapterConfig();

  return {
    /* Homepage */

    getStats,

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

    getBlocks: async ({ size = 1, shard, epochId, proposer }: helpers.GetBlocksType) => {
      try {
        const { data: blocks, success } = await provider({
          url: `/blocks`,
          params: {
            from: (size - 1) * 25,
            size: 25,
            ...(proposer ? { proposer } : {}),
            ...helpers.getShardOrEpochParam(shard, epochId),
            fields: ['hash', 'nonce', 'shard', 'size', 'sizeTxs', 'timestamp', 'txCount'].join(','),
          },
        });
        if (success) {
          return {
            data: helpers.processBlocks(blocks),
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

    getBlocksCount: ({ shard, epochId }: helpers.GetBlocksType) =>
      provider({ url: `/blocks/count`, params: helpers.getShardOrEpochParam(shard, epochId) }),

    /* Transaction */

    getTransaction: (transactionId: string) => provider({ url: `/transactions/${transactionId}` }),

    /* Miniblocks */

    getMiniBlock: (miniBlockHash: string) => provider({ url: `/miniblocks/${miniBlockHash}` }),

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
      provider({ url: `/transactions/count`, params: { miniBlockHash } }),

    /* Transactions */

    getTransactions: ({
      size,
      address,
      senderShard,
      receiverShard,
    }: helpers.TransactionsParamsType) =>
      provider({
        url: `/transactions`,
        params: helpers.getTransactionsParams({ size, address, senderShard, receiverShard }),
      }),

    getTransactionsCount: ({
      address,
      senderShard,
      receiverShard,
    }: helpers.TransactionsParamsType) =>
      provider({
        url: `/transactions/count`,
        params: {
          ...helpers.getAccountParams(address),
          ...(senderShard !== undefined ? { senderShard } : {}),
          ...(receiverShard !== undefined ? { receiverShard } : {}),
        },
      }),

    getRewards: (address: string) => getRewards(address),

    /* Validators */

    getShards,

    getNodes: (props: helpers.GetNodesType) =>
      getNodes({
        url: `/nodes`,
        params: helpers.getNodeParams(props),
      }),

    getNodesCount: ({
      peerType,
      issues,
      search,
      nodeType,
      shard,
      status,
      identity,
    }: helpers.GetNodesType) =>
      getNodes({
        url: `/nodes/count`,
        params: helpers.getNodeParams({
          peerType,
          issues,
          search,
          nodeType,
          shard,
          status,
          identity,
        }),
      }),

    getIdentities: () => provider({ url: `/identities` }),

    getIdentity: (identity: string) => provider({ url: `/identities/${identity}` }),

    getNode: (key: string) => getNodes({ url: `/nodes/${key}` }),

    getRounds: (validator: string) =>
      provider({
        url: `/rounds`,
        params: {
          size: 138,
          from: 0,
          validator,
        },
      }),

    getAccount: (address: string) => provider({ url: `/accounts/${address}` }),

    getAccounts: (size = 1) =>
      provider({
        url: `/accounts`,
        params: {
          from: (size - 1) * 25,
          size: 25,
        },
      }),

    getAccountsCount: () => provider({ url: `/accounts/count` }),
  };
}
