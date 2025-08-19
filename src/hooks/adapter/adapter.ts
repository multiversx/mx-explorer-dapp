import { PAGE_SIZE, TRANSACTIONS_TABLE_FIELDS } from 'appConstants';
import {
  AccountRolesTypeEnum,
  GetAccountType,
  GetEventsType,
  GetProofsType,
  ExchangePriceRangeEnum
} from 'types';
import {
  BaseApiType,
  GetBlocksType,
  GetTransactionsType,
  GetNodesType,
  GetProvidersType,
  GetCollectionsType,
  GetNftsType,
  GetTokensType,
  GetAccountsType,
  GetIdentitiesType,
  GetTransactionsInPoolType
} from 'types/adapter.types';

import {
  processBlocks,
  getShardAndEpochParams,
  getTransactionsParams,
  getNodeParams,
  getProviderParams,
  getTokensParams,
  getCollectionsParams,
  getNftsParams,
  getTransactionsInPoolParams,
  getPageParams,
  getProofsParams,
  getEventsParams
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
          fields: TRANSACTIONS_TABLE_FIELDS.join(',')
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
      page,
      size,
      shard,
      epoch,
      proposer,
      withProposerIdentity
    }: GetBlocksType) => {
      try {
        const { data: blocks, success } = await provider({
          url: '/blocks',
          params: {
            ...getPageParams({ page, size }),
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
        params: getTransactionsParams({ isCount: true, ...params })
      }),

    getTransfers: (params: GetTransactionsType) =>
      provider({
        url: '/transfers',
        params: getTransactionsParams(params)
      }),

    getTransfersCount: (params: GetTransactionsType) =>
      provider({
        url: '/transfers/c',
        params: getTransactionsParams({ isCount: true, ...params })
      }),

    /* SC Results */

    getScResult: (hash: string) => provider({ url: `/results/${hash}` }),

    getScResults: ({ page, size }: BaseApiType) =>
      provider({
        url: '/results',
        params: getPageParams({ page, size })
      }),

    getScResultsCount: () => provider({ url: '/results/c' }),

    /* Events */

    getEvent: (hash: string) => provider({ url: `/events/${hash}` }),

    getEvents: (params: GetEventsType) =>
      provider({
        url: '/events',
        params: getEventsParams(params)
      }),

    getEventsCount: (params: GetEventsType) =>
      provider({
        url: '/events/count',
        params: getEventsParams({ isCount: true, ...params })
      }),

    /* Transactions Pool */

    getTransactionInPool: (hash: string) => provider({ url: `/pool/${hash}` }),

    getTransactionsInPool: (params: GetTransactionsInPoolType) =>
      provider({
        url: '/pool',
        params: getTransactionsInPoolParams(params)
      }),

    getTransactionsInPoolCount: (params: GetTransactionsInPoolType) =>
      provider({
        url: '/pool/c',
        params: getTransactionsInPoolParams({ isCount: true, ...params })
      }),

    /* Account */

    getAccount: ({ address, ...rest }: GetAccountType) =>
      provider({ url: `/accounts/${address}`, params: rest }),

    getAccounts: ({
      page,
      size,
      isSmartContract,
      withOwnerAssets = false,
      withDeployInfo = false,
      withTxCount = false,
      withScrCount = false,
      ...rest
    }: GetAccountsType) =>
      provider({
        url: '/accounts',
        timeout: 15000,
        params: {
          ...getPageParams({ page, size }),
          ...(isSmartContract !== undefined ? { isSmartContract } : {}),
          ...(withOwnerAssets ? { withOwnerAssets } : {}),
          ...(withDeployInfo ? { withDeployInfo } : {}),
          ...(withTxCount ? { withTxCount } : {}),
          ...(withScrCount ? { withScrCount } : {}),
          ...rest
        }
      }),

    getAccountsCount: (params: GetAccountsType) =>
      provider({ url: '/accounts/c', params }),

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
          isCount: true,
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
        params: getTokensParams({ isCount: true, ...rest })
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
        params: getNftsParams({ isCount: true, ...rest })
      }),

    getAccountContracts: ({
      address,
      page,
      size
    }: BaseApiType & { address: string }) =>
      provider({
        url: `/accounts/${address}/contracts`,
        params: getPageParams({ page, size })
      }),

    getAccountContractsCount: (address: string) =>
      provider({ url: `/accounts/${address}/contracts/c` }),

    getAccountHistory: ({
      address,
      identifier,
      size
    }: {
      address: string;
      identifier?: string;
      size?: number;
    }) => {
      if (identifier) {
        return provider({
          url: `/accounts/${address}/history/${identifier}`,
          params: {
            ...(size !== undefined ? { size } : {})
          }
        });
      }

      return provider({
        url: `/accounts/${address}/history`,
        params: {
          ...(size !== undefined ? { size } : {})
        }
      });
    },

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
      page,
      size
    }: GetNftsType & { address: string; type: AccountRolesTypeEnum }) =>
      provider({
        url: `/accounts/${address}/roles/${type}`,
        params: getPageParams({ page, size })
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
      provider({
        url: '/nodes',
        params: getNodeParams(params)
      }),

    getNodesCount: (params?: GetNodesType) =>
      provider({
        url: '/nodes/c',
        params: getNodeParams({ isCount: true, ...params })
      }),

    getAuctionNodes: () =>
      provider({
        url: '/nodes/auctions'
      }),

    getNodesVersions,

    getIdentities: ({ identities, fields, sort, order }: GetIdentitiesType) =>
      provider({
        url: '/identities',
        params: {
          identities,
          ...(fields !== undefined ? { fields } : {}),
          ...(sort !== undefined ? { sort } : {}),
          ...(order !== undefined ? { order } : {})
        }
      }),

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
        params: getTokensParams({ isCount: true, ...params })
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
          isCount: true,
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
          isCount: true,
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
        params: getCollectionsParams({ isCount: true, ...params })
      }),

    getCollectionNfts: ({
      collection,
      ...rest
    }: GetCollectionsType & { collection: string }) =>
      provider({
        url: `/collections/${collection}/nfts`,
        params: getNftsParams({ ...rest })
      }),

    getCollectionNftsCount: ({
      collection,
      ...rest
    }: GetCollectionsType & { collection: string }) =>
      provider({
        url: `/collections/${collection}/nfts/count`,
        params: getNftsParams({ isCount: true, ...rest })
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
          isCount: true,
          ...rest
        })
      }),

    getCollectionTransfers: ({
      identifier,
      ...rest
    }: GetTransactionsType & { identifier: string }) =>
      provider({
        url: `/collections/${identifier}/transfers`,
        params: getTransactionsParams({
          ...rest
        })
      }),

    getCollectionTransfersCount: ({
      identifier,
      ...rest
    }: GetTransactionsType & { identifier: string }) =>
      provider({
        url: `/collections/${identifier}/transfers/count`,
        params: getTransactionsParams({
          isCount: true,
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
        params: getNftsParams({
          ...params,
          isCount: true
        })
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
        params: getNftsParams({ isCount: true, ...rest })
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
          isCount: true,
          ...rest
        })
      }),

    getNftTransfers: ({
      identifier,
      ...rest
    }: GetTransactionsType & { identifier: string }) =>
      provider({
        url: `/nfts/${identifier}/transfers`,
        params: getTransactionsParams({
          ...rest
        })
      }),

    getNftTransfersCount: ({
      identifier,
      ...rest
    }: GetTransactionsType & { identifier: string }) =>
      provider({
        url: `/nfts/${identifier}/transfers/count`,
        params: getTransactionsParams({
          isCount: true,
          ...rest
        })
      }),

    // Proofs

    getProof: (identifierOrHash: string) =>
      provider({ url: `/proofs/${identifierOrHash}` }),

    getProofs: (params: GetProofsType) =>
      provider({
        url: '/proofs',
        params: getProofsParams(params)
      }),

    getProofsCount: (params: GetProofsType) =>
      provider({
        url: '/proofs/count',
        params: getProofsParams({ isCount: true, ...params })
      }),

    // General
    getStats,
    getShards,

    getStake: () => provider({ url: '/stake' }),

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

    // xExchange Data

    getExchangeTokenPriceHistory: ({
      identifier,
      range = ExchangePriceRangeEnum.hourly
    }: {
      identifier: string;
      range?: ExchangePriceRangeEnum;
    }) => {
      if (range === ExchangePriceRangeEnum.daily) {
        return provider({ url: `/mex/tokens/prices/daily/${identifier}` });
      }
      return provider({ url: `/mex/tokens/prices/hourly/${identifier}` });
    },

    // Growth Charts

    getAnalyticsChart: (url: string) => provider({ baseUrl: growthApi, url }),

    getAnalyticsChartList: () =>
      provider({ baseUrl: growthApi, url: '/explorer/analytics' }),

    getGrowthWidget: (url: string) =>
      provider({ baseUrl: `${growthApi}/explorer/widgets`, url }),

    getGrowthHeaders: (url: string) =>
      provider({ baseUrl: `${growthApi}/explorer/headers`, url }),

    // Network Config
    getNetworkConfig: (baseUrl: string) =>
      provider({
        baseUrl,
        url: '/dapp/config'
      })
  };
};
