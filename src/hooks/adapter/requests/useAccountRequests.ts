import { PAGE_SIZE } from 'appConstants';
import { AccountRolesTypeEnum, GetAccountType } from 'types';
import {
  AxiosParamsApiType,
  BaseApiType,
  GetTransactionsType,
  GetNftsType,
  GetTokensType,
  GetAccountsType,
  GetAccountHistoryType,
  GetAccountResourceType
} from 'types/adapter.types';

import {
  getTransactionsParams,
  getTokensParams,
  getNftsParams,
  getPageParams
} from '../helpers';
import { useAdapterConfig } from '../useAdapterConfig';

export const useAccountRequests = () => {
  const { provider } = useAdapterConfig();

  return {
    getAccount: ({ address, signal, timeout, ...params }: GetAccountType) =>
      provider({ url: `/accounts/${address}`, timeout, signal, params }),

    getUsername: (
      username: string,
      { signal, timeout }: AxiosParamsApiType = {}
    ) =>
      provider({
        url: `/usernames/${username}`,
        signal,
        timeout
      }),

    getAccounts: ({
      timeout = 15000,
      signal,
      page,
      size,
      isSmartContract,
      withOwnerAssets = false,
      withDeployInfo = false,
      withTxCount = false,
      withScrCount = false,
      ...params
    }: GetAccountsType) =>
      provider({
        url: '/accounts',
        timeout,
        signal,
        params: {
          ...getPageParams({ page, size }),
          ...(isSmartContract !== undefined ? { isSmartContract } : {}),
          ...(withOwnerAssets ? { withOwnerAssets } : {}),
          ...(withDeployInfo ? { withDeployInfo } : {}),
          ...(withTxCount ? { withTxCount } : {}),
          ...(withScrCount ? { withScrCount } : {}),
          ...params
        }
      }),

    getAccountsCount: ({ timeout, signal, ...params }: GetAccountsType = {}) =>
      provider({ url: '/accounts/c', timeout, signal, params }),

    getAccountTransfers: ({
      address,
      timeout,
      signal,
      ...params
    }: GetTransactionsType) =>
      provider({
        url: `/accounts/${address}/transfers`,
        timeout,
        signal,
        params: getTransactionsParams({
          ...params
        })
      }),

    getAccountTransfersCount: ({
      address,
      timeout,
      signal,
      ...params
    }: GetTransactionsType = {}) =>
      provider({
        url: `/accounts/${address}/transfers/c`,
        timeout,
        signal,
        params: getTransactionsParams({
          isCount: true,
          ...params
        })
      }),

    getAccountTokens: ({
      address,
      timeout,
      signal,
      ...params
    }: GetTokensType & GetAccountResourceType) =>
      provider({
        url: `/accounts/${address}/tokens`,
        timeout,
        signal,
        params: getTokensParams({ ...params })
      }),

    getAccountTokensCount: ({
      address,
      timeout,
      signal,
      ...params
    }: GetTokensType & GetAccountResourceType) =>
      provider({
        url: `/accounts/${address}/tokens/c`,
        timeout,
        signal,
        params: getTokensParams({ isCount: true, ...params })
      }),

    getAccountNfts: ({
      address,
      timeout,
      signal,
      ...params
    }: GetNftsType & GetAccountResourceType) =>
      provider({
        url: `/accounts/${address}/nfts`,
        timeout,
        signal,
        params: getNftsParams({ ...params, includeFlagged: true })
      }),

    getAccountNftsCount: ({
      address,
      timeout,
      signal,
      ...params
    }: GetNftsType & GetAccountResourceType) =>
      provider({
        url: `/accounts/${address}/nfts/c`,
        timeout,
        signal,
        params: getNftsParams({ isCount: true, ...params })
      }),

    getAccountContracts: ({
      address,
      page,
      size,
      searchAfter,
      timeout,
      signal
    }: BaseApiType & GetAccountResourceType) =>
      provider({
        url: `/accounts/${address}/contracts`,
        timeout,
        signal,
        params: getPageParams({ page, size, searchAfter })
      }),

    getAccountContractsCount: (
      address: string,
      { signal, timeout }: AxiosParamsApiType = {}
    ) => provider({ url: `/accounts/${address}/contracts/c`, timeout, signal }),

    getAccountHistory: ({
      address,
      identifier,
      size,
      timeout,
      signal
    }: GetAccountHistoryType) => {
      if (identifier) {
        return provider({
          url: `/accounts/${address}/history/${identifier}`,
          timeout,
          signal,
          params: {
            ...(size !== undefined ? { size } : {})
          }
        });
      }

      return provider({
        url: `/accounts/${address}/history`,
        timeout,
        signal,
        params: {
          ...(size !== undefined ? { size } : {})
        }
      });
    },

    getAccountContractVerification: ({
      address,
      timeout,
      signal
    }: GetAccountResourceType) =>
      provider({
        url: `/accounts/${address}/verification`,
        timeout,
        signal
      }),

    getAccountUpgrades: ({
      address,
      size = PAGE_SIZE,
      timeout,
      signal
    }: BaseApiType & GetAccountResourceType) =>
      provider({
        url: `/accounts/${address}/upgrades`,
        timeout,
        signal,
        params: {
          size
        }
      }),

    getAccountAssets: ({ address, timeout, signal }: GetAccountResourceType) =>
      provider({
        url: `/accounts/${address}`,
        timeout,
        signal,
        params: {
          fields: 'assets,username'
        }
      }),

    /* Account Stake */

    getAccountDelegation: (
      address: string,
      { timeout, signal }: AxiosParamsApiType = {}
    ) => provider({ url: `/accounts/${address}/delegation`, timeout, signal }),

    getAccountDelegationLegacy: (
      address: string,
      { timeout, signal }: AxiosParamsApiType = {}
    ) =>
      provider({
        url: `/accounts/${address}/delegation-legacy`,
        timeout,
        signal
      }),

    getAccountStake: (
      address: string,
      { timeout, signal }: AxiosParamsApiType = {}
    ) => provider({ url: `/accounts/${address}/stake`, timeout, signal }),

    /* Account Roles */

    getAccountRoles: ({
      address,
      type,
      page,
      size,
      searchAfter,
      timeout,
      signal
    }: BaseApiType & GetAccountResourceType & { type: AccountRolesTypeEnum }) =>
      provider({
        url: `/accounts/${address}/roles/${type}`,
        timeout,
        signal,
        params: getPageParams({ page, size, searchAfter })
      }),

    getAccountRolesCount: ({
      address,
      type,
      timeout,
      signal
    }: GetAccountResourceType & {
      type: AccountRolesTypeEnum;
    }) =>
      provider({
        url: `/accounts/${address}/roles/${type}/c`,
        timeout,
        signal
      })
  };
};
