import { PAGE_SIZE } from 'appConstants';
import { AccountRolesTypeEnum } from 'types';
import {
  GetBlocksType,
  GetTransactionsType,
  GetNodesType,
  GetProvidersType,
  GetCollectionsType,
  GetNftsType,
  GetTokensType,
  GetAccountsType
} from 'types/adapter.types';

import {
  processBlocks,
  getShardAndEpochParams,
  getTransactionsParams,
  getNodeParams,
  getProviderParams,
  getTokensParams,
  getCollectionsParams,
  getNftsParams
} from './helpers';
import { useAdapterConfig } from './useAdapterConfig';

export const useAdapter = () => {
  const {
    provider,
    getStats,
    getNodes,
    getNodesVersions,
    getShards,
    getEconomics,
    getProviders,
    getProvider,
    growthApi
  } = useAdapterConfig();

  return {
    /* Homepage */

    getLatestBlocks: ({ size = 5 }: GetBlocksType) =>
      provider({
        url: '/blocks',
        params: {
          size,
          ...{
            fields: [
              'hash',
              'nonce',
              'shard',
              'size',
              'sizeTxs',
              'timestamp',
              'txCount'
            ].join(',')
          }
        }
      }),
    getLatestTransactions: ({
      size = 5,
      withUsername = true
    }: GetTransactionsType) =>
      provider({
        url: '/transactions',
        params: {
          size,
          withUsername,
          ...{
            fields: [
              'txHash',
              'receiver',
              'receiverShard',
              'receiverAssets',
              'sender',
              'senderShard',
              'senderAssets',
              'status',
              'timestamp',
              'value',
              'miniBlockHash',
              'round',
              'tokenValue',
              'tokenIdentifier',
              'action',
              'results'
            ].join(',')
          }
        }
      }),

    /* Blocks */

    getBlock: async (blockId: string) => {
      try {
        const { data: block, success } = await provider({
          url: `/blocks/${blockId}`
        });

        let nextHash;
        try {
          const { data } = await provider({
            url: '/blocks',
            params: {
              nonce: block.nonce + 1,
              shard: block.shard
            }
          });

          nextHash = data[0] ? data[0].hash : '';
        } catch {
          nextHash = '';
        }

        return {
          block,
          nextHash,
          success
        };
      } catch {
        return { success: false };
      }
    },

    getBlocks: async ({
      page = 1,
      size = PAGE_SIZE,
      shard,
      epoch,
      proposer,
      withProposerIdentity
    }: GetBlocksType) => {
      try {
        const { data: blocks, success } = await provider({
          url: '/blocks',
          params: {
            from: (page - 1) * size,
            size,
            ...(proposer ? { proposer } : {}),
            ...(withProposerIdentity ? { withProposerIdentity } : {}),
            ...getShardAndEpochParams(shard, epoch),
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
              'proposer',
              'proposerIdentity'
            ].join(',')
          }
        });
        if (success) {
          return {
            data: processBlocks(blocks),
            success
          };
        } else {
          return { success: false };
        }
      } catch (err) {
        return {
          success: false
        };
      }
    },

    getBlocksCount: ({ shard, epoch }: GetBlocksType) =>
      provider({
        url: '/blocks/c',
        params: getShardAndEpochParams(shard, epoch)
      }),

    /* Miniblocks */

    getMiniBlock: (miniBlockHash: string) =>
      provider({ url: `/miniblocks/${miniBlockHash}` }),

    /* Transactions */

    getTransaction: (transactionId: string) =>
      provider({ url: `/transactions/${transactionId}` }),

    getTransactions: (params: GetTransactionsType) =>
      provider({
        url: '/transactions',
        params: getTransactionsParams(params)
      }),

    getTransactionsCount: (params: GetTransactionsType) =>
      provider({
        url: '/transactions/c',
        params: getTransactionsParams(params)
      }),

    getTransfers: (params: GetTransactionsType) =>
      provider({
        url: '/transfers',
        params: getTransactionsParams(params)
      }),

    getTransfersCount: (params: GetTransactionsType) =>
      provider({
        url: '/transfers/c',
        params: getTransactionsParams(params)
      }),

    /* SC Results */

    getScResult: (hash: string) => provider({ url: `/sc-results/${hash}` }),

    getScResults: ({
      page = 1,
      size = PAGE_SIZE
    }: {
      page?: number;
      size?: number;
    }) =>
      provider({
        url: '/sc-results',
        params: {
          from: (page - 1) * size,
          size
        }
      }),

    getScResultsCount: () => provider({ url: '/sc-results/c' }),

    /* Account */

    getAccount: ({
      address,
      ...rest
    }: {
      address: string;
      withGuardianInfo?: boolean;
    }) => provider({ url: `/accounts/${address}`, params: rest }),

    getAccounts: ({
      page = 1,
      size = PAGE_SIZE,
      isSmartContract = false,
      withOwnerAssets = false,
      ...rest
    }: GetAccountsType) =>
      provider({
        url: '/accounts',
        params: {
          from: (page - 1) * size,
          size,
          isSmartContract,
          withOwnerAssets,
          ...rest
        }
      }),

    getAccountsCount: ({ isSmartContract }: GetAccountsType) =>
      provider({ url: '/accounts/c', params: { isSmartContract } }),

    getAccountTransfers: ({ address, ...rest }: GetTransactionsType) =>
      provider({
        url: `/accounts/${address}/transfers`,
        params: getTransactionsParams({
          ...rest
        })
      }),

    getAccountTransfersCount: ({ address, ...rest }: GetTransactionsType) =>
      provider({
        url: `/accounts/${address}/transfers/c`,
        params: getTransactionsParams({
          ...rest
        })
      }),

    getAccountTokens: ({
      address,
      ...rest
    }: GetTokensType & { address: string }) =>
      provider({
        url: `/accounts/${address}/tokens`,
        params: getTokensParams({ ...rest })
      }),

    getAccountTokensCount: ({
      address,
      ...rest
    }: GetTokensType & { address: string }) =>
      provider({
        url: `/accounts/${address}/tokens/c`,
        params: getTokensParams({ ...rest })
      }),

    getAccountNfts: ({ address, ...rest }: GetNftsType & { address: string }) =>
      provider({
        url: `/accounts/${address}/nfts`,
        params: getNftsParams({ ...rest, includeFlagged: true })
      }),

    getAccountNftsCount: ({
      address,
      ...rest
    }: GetNftsType & { address: string }) =>
      provider({
        url: `/accounts/${address}/nfts/c`,
        params: getNftsParams({ ...rest, includeFlagged: true })
      }),

    getAccountContracts: ({
      address,
      page = 1,
      size = PAGE_SIZE
    }: {
      address: string;
      page: number;
      size?: number;
    }) =>
      provider({
        url: `/accounts/${address}/contracts`,
        params: {
          from: (page - 1) * size,
          size
        }
      }),

    getAccountContractsCount: (address: string) =>
      provider({ url: `/accounts/${address}/contracts/c` }),

    getAccountHistory: ({
      address,
      size
    }: {
      address: string;
      size?: number;
    }) =>
      provider({
        url: `/accounts/${address}/history`,
        params: {
          ...(size !== undefined ? { size } : {})
        }
      }),

    getAccountContractVerification: ({ address }: { address: string }) =>
      provider({
        url: `/accounts/${address}/verification`
      }),

    getAccountUpgrades: ({
      address,
      size = PAGE_SIZE
    }: {
      address: string;
      size: number;
    }) =>
      provider({
        url: `/accounts/${address}/upgrades`,
        params: {
          size
        }
      }),

    getAccountAssets: ({ address }: { address: string }) =>
      provider({
        url: `/accounts/${address}`,
        params: {
          fields: 'assets,username'
        }
      }),

    /* Account Stake */

    getAccountDelegation: (address: string) =>
      provider({ url: `/accounts/${address}/delegation` }),

    getAccountDelegationLegacy: (address: string) =>
      provider({ url: `/accounts/${address}/delegation-legacy` }),

    getAccountStake: (address: string) =>
      provider({ url: `/accounts/${address}/stake` }),

    /* Account Roles */

    getAccountRoles: ({
      address,
      type,
      page = 1,
      size = PAGE_SIZE
    }: {
      address: string;
      type: AccountRolesTypeEnum;
      page?: number;
      size?: number;
    }) =>
      provider({
        url: `/accounts/${address}/roles/${type}`,
        params: {
          from: (page - 1) * size,
          size
        }
      }),

    getAccountRolesCount: ({
      address,
      type
    }: {
      address: string;
      type: AccountRolesTypeEnum;
    }) => provider({ url: `/accounts/${address}/roles/${type}/c` }),

    /* Validators */

    getNode: (key: string) => getNodes({ url: `/nodes/${key}` }),

    getNodes: (params: GetNodesType) =>
      getNodes({
        url: '/nodes',
        params: getNodeParams(params)
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
      fullHistory
    }: GetNodesType) =>
      getNodes({
        url: '/nodes/c',
        params: getNodeParams({
          online,
          issues,
          search,
          type,
          shard,
          status,
          identity,
          provider,
          fullHistory
        })
      }),

    getNodesVersions,

    getIdentities: (identities?: string) =>
      provider({ url: '/identities', params: { identities } }),

    getIdentity: (identity: string) =>
      provider({ url: `/identities/${identity}` }),

    getRounds: ({
      validator,
      shard,
      epoch
    }: {
      validator: string;
      shard: number;
      epoch: number;
    }) =>
      provider({
        url: '/rounds',
        params: {
          size: 138,
          from: 0,
          validator,
          shard,
          epoch
        }
      }),

    // Providers

    getProviders: (params: GetProvidersType) =>
      getProviders({
        url: '/providers',
        params: getProviderParams(params)
      }),

    getProvider: ({ address }: { address: string }) =>
      getProvider({ url: `/providers/${address}` }),

    // Tokens

    getToken: (tokenId: string) => provider({ url: `/tokens/${tokenId}` }),

    getTokens: (params: GetTokensType) =>
      provider({
        url: '/tokens',
        params: getTokensParams(params)
      }),

    getTokensCount: (params: GetTokensType) =>
      provider({
        url: '/tokens/c',
        params: getTokensParams(params)
      }),

    getTokenTransactions: ({
      tokenId,
      ...rest
    }: GetTransactionsType & { tokenId: string }) =>
      provider({
        url: `/tokens/${tokenId}/transactions`,
        params: getTransactionsParams({
          ...rest
        })
      }),

    getTokenTransactionsCount: ({
      tokenId,
      ...rest
    }: GetTransactionsType & { tokenId: string }) =>
      provider({
        url: `/tokens/${tokenId}/transactions/c`,
        params: getTransactionsParams({
          ...rest
        })
      }),

    getTokenTransfers: ({
      tokenId,
      ...rest
    }: GetTransactionsType & { tokenId: string }) =>
      provider({
        url: `/tokens/${tokenId}/transfers`,
        params: getTransactionsParams({
          ...rest
        })
      }),

    getTokenTransfersCount: ({
      tokenId,
      ...rest
    }: GetTransactionsType & { tokenId: string }) =>
      provider({
        url: `/tokens/${tokenId}/transfers/c`,
        params: getTransactionsParams({
          ...rest
        })
      }),

    getTokenAccounts: ({
      tokenId,
      ...rest
    }: GetTokensType & { tokenId: string }) =>
      provider({
        url: `/tokens/${tokenId}/accounts`,
        params: getTokensParams({ ...rest })
      }),

    getTokenAccountsCount: ({ tokenId }: { tokenId: string }) =>
      provider({
        url: `/tokens/${tokenId}/accounts/count`
      }),

    getTokenSupply: ({ tokenId }: { tokenId: string }) =>
      provider({
        url: `/tokens/${tokenId}/supply`
      }),

    // Collections

    getCollection: (collection: string) =>
      provider({ url: `/collections/${collection}` }),

    getCollections: (params: GetCollectionsType) =>
      provider({
        url: '/collections',
        params: getCollectionsParams(params)
      }),

    getCollectionsCount: (params: GetCollectionsType) =>
      provider({
        url: '/collections/c',
        params: getCollectionsParams(params)
      }),

    getCollectionNfts: ({
      collection,
      ...rest
    }: GetCollectionsType & { collection: string }) =>
      provider({
        url: `/collections/${collection}/nfts`,
        params: getCollectionsParams({ ...rest })
      }),

    getCollectionNftsCount: ({
      collection,
      ...rest
    }: GetCollectionsType & { collection: string }) =>
      provider({
        url: `/collections/${collection}/nfts/count`,
        params: getCollectionsParams({ ...rest })
      }),

    getCollectionTransactions: ({
      identifier,
      ...rest
    }: GetTransactionsType & { identifier: string }) =>
      provider({
        url: `/collections/${identifier}/transactions`,
        params: getTransactionsParams({
          ...rest
        })
      }),

    getCollectionTransactionsCount: ({
      identifier,
      ...rest
    }: GetTransactionsType & { identifier: string }) =>
      provider({
        url: `/collections/${identifier}/transactions/count`,
        params: getTransactionsParams({
          ...rest
        })
      }),

    // Nfts

    getNft: (identifier: string) => provider({ url: `/nfts/${identifier}` }),

    getNfts: (params: GetNftsType) =>
      provider({
        url: '/nfts',
        params: getNftsParams({ ...params, includeFlagged: true })
      }),

    getNftsCount: (params: GetNftsType) =>
      provider({
        url: '/nfts/c',
        params: getNftsParams({ ...params, includeFlagged: true })
      }),

    getNftAccounts: ({
      identifier,
      ...rest
    }: GetNftsType & { identifier: string }) =>
      provider({
        url: `/nfts/${identifier}/accounts`,
        params: getNftsParams({ ...rest, includeFlagged: true })
      }),

    getNftAccountsCount: ({
      identifier,
      ...rest
    }: GetNftsType & { identifier: string }) =>
      provider({
        url: `/nfts/${identifier}/accounts/count`,
        params: getNftsParams({ ...rest, includeFlagged: true })
      }),

    getNftTransactions: ({
      identifier,
      ...rest
    }: GetTransactionsType & { identifier: string }) =>
      provider({
        url: `/nfts/${identifier}/transactions`,
        params: getTransactionsParams({
          ...rest
        })
      }),

    getNftTransactionsCount: ({
      identifier,
      ...rest
    }: GetTransactionsType & { identifier: string }) =>
      provider({
        url: `/nfts/${identifier}/transactions/count`,
        params: getTransactionsParams({
          ...rest
        })
      }),

    // General
    getStats,
    getShards,

    getGlobalStake: () => provider({ url: '/stake' }),

    getEconomics: () => getEconomics({ url: '/economics' }),

    getUsername: (username: string) =>
      provider({
        url: `/usernames/${username}`
      }),

    getMarkers: (baseUrl: string) =>
      provider({
        baseUrl,
        url: ''
      }),

    // Growth Charts

    getAnalyticsChart: (url: string) => provider({ baseUrl: growthApi, url }),

    getAnalyticsChartList: () =>
      provider({ baseUrl: growthApi, url: '/explorer/analytics' }),

    getGrowthWidget: (url: string) =>
      provider({ baseUrl: `${growthApi}/explorer/widgets`, url }),

    getGrowthHeaders: (url: string) =>
      provider({ baseUrl: `${growthApi}/explorer/headers`, url })
  };
};
