import { pageSize } from 'appConfig';
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
  GetNftsType,
  GetTokensType,
  getTokensParam,
  getNftsParam,
} from './helpers';

export default function useAdapter() {
  const {
    provider,
    getStats,
    getNodes,
    getNodesVersions,
    getShards,
    getEconomics,
    getProviders,
    getProvider,
    getEgldPriceHistory,
    getEgldMarketCapHistory,
    getEgldVolumeHistory,
    getTotalStakedHistory,
    getUsersStaking,
    getTransactionsHistory,
    getAccountsHistory,
    delegationApi,
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
              'tokenValue',
              'tokenIdentifier',
              'action',
              'results',
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
            from: (size - 1) * pageSize,
            size: pageSize,
            ...(proposer ? { proposer } : {}),
            ...getShardAndEpochParam(shard, epoch),
            fields: [
              'hash',
              'nonce',
              'shard',
              'size',
              'sizeTxs',
              'timestamp',
              'txCount',
              'gasConsumed',
              'gasRefunded',
              'gasPenalized',
              'maxGasLimit',
            ].join(','),
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
      provider({ url: `/blocks/c`, params: getShardAndEpochParam(shard, epoch) }),

    /* Transaction */

    getTransaction: (transactionId: string) => provider({ url: `/transactions/${transactionId}` }),

    /* Miniblocks */

    getMiniBlock: (miniBlockHash: string) => provider({ url: `/miniblocks/${miniBlockHash}` }),

    getMiniBlockTransactions: ({ miniBlockHash, size }: { miniBlockHash: string; size: number }) =>
      provider({
        url: `/transactions`,
        params: {
          from: (size - 1) * pageSize,
          size: pageSize,
          miniBlockHash,
        },
      }),

    getMiniBlockTransactionsCount: (miniBlockHash: string) =>
      provider({ url: `/transactions/c`, params: { miniBlockHash } }),

    getMiniBlockScResults: ({ miniBlockHash, size }: { miniBlockHash: string; size: number }) =>
      provider({
        url: `/sc-results`,
        params: {
          from: (size - 1) * pageSize,
          size: pageSize,
          miniBlockHash,
        },
      }),

    /* Transactions */

    getTransactions: ({
      size,
      address,
      senderShard,
      receiverShard,
      withScResults,
      withOperations,
    }: TransactionsParamsType) =>
      provider({
        url: `/transactions`,
        params: getTransactionsParams({
          size,
          address,
          senderShard,
          receiverShard,
          withScResults,
          withOperations,
        }),
      }),

    getTransactionsCount: ({ address, senderShard, receiverShard }: TransactionsParamsType) =>
      provider({
        url: `/transactions/c`,
        params: {
          ...getAccountParams(address),
          ...(senderShard !== undefined ? { senderShard } : {}),
          ...(receiverShard !== undefined ? { receiverShard } : {}),
        },
      }),

    getAccountTransfers: ({ address, size }: { address: string; size: number }) =>
      provider({
        url: `/accounts/${address}/transfers`,
        params: {
          from: (size - 1) * pageSize,
          size: pageSize,
        },
      }),

    getAccountTransfersCount: (address: string) =>
      provider({ url: `/accounts/${address}/transfers/c` }),

    getAccountScResults: ({ address, size }: { address: string; size: number }) =>
      provider({
        url: `/accounts/${address}/sc-results`,
        params: {
          from: (size - 1) * pageSize,
          size: pageSize,
        },
      }),

    getAccountScResultsCount: (address: string) =>
      provider({ url: `/accounts/${address}/sc-results/c` }),

    getAccountContracts: ({ address, size }: { address: string; size: number }) =>
      provider({
        url: `/accounts/${address}/contracts`,
        params: {
          from: (size - 1) * pageSize,
          size: pageSize,
        },
      }),

    getAccountContractsCount: (address: string) =>
      provider({ url: `/accounts/${address}/contracts/c` }),

    getScResult: (hash: string) => provider({ url: `/sc-results/${hash}` }),

    getScResults: (size = 1) =>
      provider({
        url: `/sc-results`,
        params: {
          from: (size - 1) * pageSize,
          size: pageSize,
        },
      }),

    getScResultsCount: () => provider({ url: `/sc-results/c` }),

    /* Stake */

    getAccountDelegation: (address: string) =>
      provider({ url: `/accounts/${address}/delegations`, baseUrl: delegationApi }),

    getAccountDelegationLegacy: (address: string) =>
      provider({ url: `/accounts/${address}/delegation-legacy` }),

    getAccountStake: (address: string) => provider({ url: `/accounts/${address}/stake` }),

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
        url: `/nodes/c`,
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
          from: (size - 1) * pageSize,
          size: pageSize,
        },
      }),

    getAccountsCount: () => provider({ url: `/accounts/c` }),

    getGlobalStake: () => provider({ url: `/stake` }),

    // Tokens

    getAccountTokens: ({ address, size }: { address: string; size: number }) =>
      provider({
        url: `/accounts/${address}/tokens`,
        params: {
          from: (size - 1) * pageSize,
          size: pageSize,
        },
      }),

    getAccountTokensCount: (address: string) => provider({ url: `/accounts/${address}/tokens/c` }),

    getTokens: (props: GetTokensType) =>
      provider({
        url: `/tokens`,
        params: getTokensParam(props),
      }),

    getTokensCount: ({ search }: GetTokensType) =>
      provider({
        url: `/tokens/c`,
        params: getTokensParam({ search }),
      }),

    getToken: (tokenId: string) => provider({ url: `/tokens/${tokenId}` }),

    getTokenTransactions: ({ size, tokenId }: { size: number; tokenId: string }) =>
      provider({
        url: `/tokens/${tokenId}/transactions`,
        params: getTokensParam({ size }),
      }),

    getTokenTransactionsCount: ({ tokenId }: { tokenId: string }) =>
      provider({
        url: `/tokens/${tokenId}/transactions/c`,
      }),

    getTokenTransfers: ({ size, tokenId }: { size: number; tokenId: string }) =>
      provider({
        url: `/tokens/${tokenId}/transfers`,
        params: getTokensParam({ size }),
      }),

    getTokenTransfersCount: ({ tokenId }: { tokenId: string }) =>
      provider({
        url: `/tokens/${tokenId}/transfers/c`,
      }),

    getTokenAccounts: ({ size, tokenId }: { size: number; tokenId: string }) =>
      provider({
        url: `/tokens/${tokenId}/accounts`,
        params: getTokensParam({ size }),
      }),

    getTokenAccountsCount: ({ tokenId }: { tokenId: string }) =>
      provider({
        url: `/tokens/${tokenId}/accounts/c`,
      }),

    getTokenRoles: ({ tokenId }: { tokenId: string }) =>
      provider({
        url: `/tokens/${tokenId}/roles`,
      }),

    getTokenSupply: ({ tokenId }: { tokenId: string }) =>
      provider({
        url: `/tokens/${tokenId}/supply`,
      }),

    // Nfts

    getAccountNfts: ({ address, size, type }: { address: string; size: number; type?: string }) =>
      provider({
        url: `/accounts/${address}/nfts`,
        params: getNftsParam({ size, type, includeFlagged: true }),
      }),

    getAccountNftsCount: ({ address, type }: { address: string; type?: string }) =>
      provider({
        url: `/accounts/${address}/nfts/c`,
        params: getNftsParam({ type, includeFlagged: true }),
      }),

    getCollections: (props: GetNftsType) =>
      provider({
        url: `/collections`,
        params: getNftsParam(props),
      }),

    getCollectionsCount: ({ search, type }: GetNftsType) =>
      provider({
        url: `/collections/c`,
        params: getNftsParam({ search, type }),
      }),

    getCollection: (collection: string) => provider({ url: `/collections/${collection}` }),

    getNfts: (props: GetNftsType) =>
      provider({
        url: `/nfts`,
        params: getNftsParam({ ...props, includeFlagged: true }),
      }),

    getNftsCount: (props: GetNftsType) =>
      provider({
        url: `/nfts/c`,
        params: getNftsParam({ ...props, includeFlagged: true }),
      }),

    getNftAccounts: (props: GetNftsType) =>
      provider({
        url: `/nfts/${props.identifier}/accounts`,
        params: getNftsParam({ ...props, includeFlagged: true }),
      }),

    getNftAccountsCount: (props: GetNftsType) =>
      provider({
        url: `/nfts/${props.identifier}/accounts/count`,
        params: getNftsParam({ ...props, includeFlagged: true }),
      }),

    getNft: (identifier: string) => provider({ url: `/nfts/${identifier}` }),

    // Providers

    getProviders: (props: GetProvidersType) =>
      getProviders({
        url: `/providers`,
        params: getProviderParams(props),
      }),

    getProvider: ({ address }: { address: string }) =>
      getProvider({ url: `/providers/${address}` }),

    getEconomics: () => getEconomics({ url: `/economics` }),

    getEgldPriceHistory,
    getEgldMarketCapHistory,
    getEgldVolumeHistory,
    getTotalStakedHistory,
    getUsersStaking,
    getTransactionsHistory,
    getAccountsHistory,
  };
}
