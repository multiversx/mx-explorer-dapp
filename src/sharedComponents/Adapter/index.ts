import useAdapterConfig from './useAdapterConfig';
import {
  GetBlocksType,
  processBlocks,
  getShardAndEpochParam,
  getTransactionsParams,
  TransactionsParamsType,
  getAccountParams,
  GetNodesType,
  getNodeParams,
  GetProvidersType,
  getProviderParams,
  GetTokensType,
  getTokensParam,
} from './helpers';

export default function useAdapter() {
  const {
    provider,
    getStats,
    getNodes,
    getNodesVersions,
    getAccountDelegation,
    getAccountStake,
    getShards,
    getEconomics,
    getEgldPrice,
    getProviders,
    getProvider,
    getEgldMarketCap,
    getEgldPriceHistory,
    getEgldMarketCapHistory,
    getEgldVolumeHistory,
    getTotalStakedHistory,
    getUsersStaking,
    getTransactionsHistory,
    getAccountsHistory,
  } = useAdapterConfig();

  return {
    /* Homepage */

    getStats,

    getLatestBlocks: ({ size = 5 }: GetBlocksType) =>
      provider({
        url: `/blocks`,
        params: {
          size,
          ...{
            fields: ['hash', 'nonce', 'shard', 'size', 'sizeTxs', 'timestamp', 'txCount'].join(','),
          },
        },
      }),
    getLatestTransactions: ({ size = 5 }: TransactionsParamsType) =>
      provider({
        url: `/transactions`,
        params: {
          size,
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
              'miniBlockHash',
              'round',
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

    getBlocks: async ({ size = 1, shard, epoch, proposer }: GetBlocksType) => {
      try {
        const { data: blocks, success } = await provider({
          url: `/blocks`,
          params: {
            from: (size - 1) * 25,
            size: 25,
            ...(proposer ? { proposer } : {}),
            ...getShardAndEpochParam(shard, epoch),
            fields: ['hash', 'nonce', 'shard', 'size', 'sizeTxs', 'timestamp', 'txCount'].join(','),
          },
        });
        if (success) {
          return {
            data: processBlocks(blocks),
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

    getBlocksCount: ({ shard, epoch }: GetBlocksType) =>
      provider({ url: `/blocks/count`, params: getShardAndEpochParam(shard, epoch) }),

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

    getMiniBlockTransactionsCount: (miniBlockHash: string) =>
      provider({ url: `/transactions/count`, params: { miniBlockHash } }),

    /* Transactions */

    getTransactions: ({ size, address, senderShard, receiverShard }: TransactionsParamsType) =>
      provider({
        url: `/transactions`,
        params: getTransactionsParams({ size, address, senderShard, receiverShard }),
      }),

    getTransactionsCount: ({ address, senderShard, receiverShard }: TransactionsParamsType) =>
      provider({
        url: `/transactions/count`,
        params: {
          ...getAccountParams(address),
          ...(senderShard !== undefined ? { senderShard } : {}),
          ...(receiverShard !== undefined ? { receiverShard } : {}),
        },
      }),

    getAccountDelegation: (address: string) =>
      getAccountDelegation({ url: `/accounts/${address}/delegation` }),

    getAccountStake: (address: string) => getAccountStake({ url: `/accounts/${address}/stake` }),

    /* Validators */

    getShards,

    getNode: (key: string) => getNodes({ url: `/nodes/${key}` }),

    getNodes: (props: GetNodesType) =>
      getNodes({
        url: `/nodes`,
        params: getNodeParams(props),
      }),

    getNodesCount: ({
      online,
      issues,
      search,
      type,
      shard,
      status,
      identity,
      provider,
    }: GetNodesType) =>
      getNodes({
        url: `/nodes/count`,
        params: getNodeParams({
          online,
          issues,
          search,
          type,
          shard,
          status,
          identity,
          provider,
        }),
      }),

    getNodesVersions,

    getIdentities: (identities?: string) =>
      provider({ url: `/identities`, params: { identities } }),

    getIdentity: (identity: string) => provider({ url: `/identities/${identity}` }),

    getRounds: ({ validator, shard, epoch }: { validator: string; shard: number; epoch: number }) =>
      provider({
        url: `/rounds`,
        params: {
          size: 138,
          from: 0,
          validator,
          shard,
          epoch,
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

    getGlobalStake: () => provider({ url: `/stake` }),

    // Tokens

    getAccountTokens: (address: string) => provider({ url: `/accounts/${address}/tokens` }),

    getTokens: (props: GetTokensType) =>
      provider({
        url: `/tokens`,
        params: getTokensParam(props),
      }),

    getTokensCount: ({ search }: GetTokensType) =>
      provider({
        url: `/tokens/count`,
        params: getTokensParam({ search }),
      }),

    getToken: (tokenId: string) => provider({ url: `/tokens/${tokenId}` }),

    // Providers

    getProviders: (props: GetProvidersType) =>
      getProviders({
        url: `/providers`,
        params: getProviderParams(props),
      }),

    getProvider: ({ address }: { address: string }) =>
      getProvider({ url: `/providers/${address}` }),

    getEconomics: () => getEconomics({ url: `/economics` }),

    getEgldPrice,
    getEgldPriceHistory,
    getEgldMarketCap,
    getEgldMarketCapHistory,
    getEgldVolumeHistory,
    getTotalStakedHistory,
    getUsersStaking,
    getTransactionsHistory,
    getAccountsHistory,
  };
}
