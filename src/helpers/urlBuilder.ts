import { TransactionDecodeParamsType } from 'hooks';
import { GetTokensType, GetCollectionsType, GetAccountsType } from 'types';

export const urlBuilder = {
  shard: (shard: number | string) => `/blocks?shard=${shard}`,
  blockDetails: (hash: number | string) => `/blocks/${hash}`,
  receiverShard: (shard: number | string) =>
    `/transactions?receiverShard=${shard}`,
  senderShard: (shard: number | string) => `/transactions?senderShard=${shard}`,
  transactionDetails: (
    hash: number | string,
    params?: TransactionDecodeParamsType
  ) => {
    const urlSearch = params
      ? new URLSearchParams(
          params as unknown as Record<string, string>
        ).toString()
      : '';

    return `/transactions/${hash}${urlSearch ? `?${urlSearch}` : ''}`;
  },
  transactionDetailsScResults: (hash: string) =>
    `/transactions/${hash}/results`,
  transactionDetailsLogs: (
    hash: string,
    params?: TransactionDecodeParamsType
  ) => {
    const urlSearch = params
      ? new URLSearchParams(
          params as unknown as Record<string, string>
        ).toString()
      : '';

    return `/transactions/${hash}/logs${urlSearch ? `?${urlSearch}` : ''}`;
  },
  transactionDetailsInnerTransactions: (
    hash: string,
    params?: TransactionDecodeParamsType
  ) => {
    const urlSearch = params
      ? new URLSearchParams(
          params as unknown as Record<string, string>
        ).toString()
      : '';

    return `/transactions/${hash}/inner-transactions${
      urlSearch ? `?${urlSearch}` : ''
    }`;
  },
  transactionInPoolDetails: (hash: string) => `/transactions/pool/${hash}`,
  eventDetails: (txHash: string) => `/events/${txHash}`,
  nodeDetails: (publicKey: string) => `/nodes/${publicKey}`,
  accounts: (params?: GetAccountsType) => {
    const urlSearch = params
      ? new URLSearchParams(params as Record<string, string>).toString()
      : '';

    return `/accounts/?${urlSearch}`;
  },
  accountDetails: (address: string) => `/accounts/${address}`,
  accountDetailsTokens: (address: string) => `/accounts/${address}/tokens`,
  accountDetailsNfts: (address: string) => `/accounts/${address}/nfts`,
  accountDetailsStaking: (address: string) => `/accounts/${address}/staking`,
  accountDetailsAnalytics: (address: string) =>
    `/accounts/${address}/analytics`,
  accountDetailsScResults: (address: string) => `/accounts/${address}/results`,
  accountDetailsContracts: (address: string) =>
    `/accounts/${address}/contracts`,
  accountDetailsUpgrades: (address: string) => `/accounts/${address}/upgrades`,
  accountDetailsContractCode: (address: string) => `/accounts/${address}/code`,
  accountDetailsContractCodeConstructor: (address: string) =>
    `/accounts/${address}/code/contract-constructor`,
  accountDetailsContractCodeDetails: (address: string) =>
    `/accounts/${address}/code/details`,
  accountDetailsContractCodeEndpoints: (address: string) =>
    `/accounts/${address}/code/endpoints`,
  accountDetailsContractCodeEndpointsRead: (address: string) =>
    `/accounts/${address}/code/endpoints-read`,
  accountDetailsContractCodeEndpointsWrite: (address: string) =>
    `/accounts/${address}/code/endpoints-write`,
  accountDetailsContractCodeEvents: (address: string) =>
    `/accounts/${address}/code/events`,
  accountDetailsContractCodeSource: (address: string) =>
    `/accounts/${address}/code/source`,
  accountDetailsContractCodeTypes: (address: string) =>
    `/accounts/${address}/code/types`,
  accountDetailsTokenRoles: (address: string) =>
    `/accounts/${address}/roles/tokens`,
  accountDetailsCollectionRoles: (address: string) =>
    `/accounts/${address}/roles/collections`,
  accountDetailsNodes: (address: string) => `/accounts/${address}/nodes`,
  applications: (params?: GetAccountsType) => {
    const urlSearch = params
      ? new URLSearchParams(params as Record<string, string>).toString()
      : '';

    return `/applications/?${urlSearch}`;
  },
  identityDetails: (id: string) => `/identities/${id}`,
  tokens: (params?: GetTokensType) => {
    const urlSearch = params
      ? new URLSearchParams(params as Record<string, string>).toString()
      : '';

    return `/tokens/?${urlSearch}`;
  },
  tokensMetaESDT: (params?: GetTokensType) => {
    const urlSearch = params
      ? new URLSearchParams(params as Record<string, string>).toString()
      : '';

    return `/meta-esdt/?${urlSearch}`;
  },
  tokenDetails: (tokenId: string) => `/tokens/${tokenId}`,
  tokenMetaEsdtDetails: (tokenId: string) => `/meta-esdt/${tokenId}`,
  tokenMetaEsdtDetailsRoles: (identifier: string) =>
    `/meta-esdt/${identifier}/roles`,
  tokenDetailsAccounts: (tokenId: string) => `/tokens/${tokenId}/accounts`,
  tokenDetailsLockedAccounts: (tokenId: string) =>
    `/tokens/${tokenId}/locked-accounts`,
  tokenDetailsRoles: (tokenId: string) => `/tokens/${tokenId}/roles`,
  proofDetails: (identifier: string) => `/proofs/${identifier}`,
  proofDetailsAccounts: (identifier: string) =>
    `/proofs/${identifier}/accounts`,
  nativeTokenDetails: (egldLabel: string) => `/${egldLabel.toLowerCase()}`,
  nativeTokenDetailsAccounts: (egldLabel: string) =>
    `/${egldLabel.toLowerCase()}/accounts`,
  collections: (params?: GetCollectionsType) => {
    const urlSearch = params
      ? new URLSearchParams(params as Record<string, string>).toString()
      : '';

    return `/collections/?${urlSearch}`;
  },
  collectionDetails: (identifier: string) => `/collections/${identifier}`,
  collectionDetailsRoles: (identifier: string) =>
    `/collections/${identifier}/roles`,
  collectionDetailsTransactions: (identifier: string) =>
    `/collections/${identifier}/transactions`,
  nftDetails: (identifier: string) => `/nfts/${identifier}`,
  nftDetailsTransactions: (identifier: string) =>
    `/nfts/${identifier}/transactions`,
  nftDetailsAccounts: (identifier: string) => `/nfts/${identifier}/accounts`,
  providerDetails: (address: string) => `/providers/${address}`,
  providerDetailsTransactions: (address: string) =>
    `/providers/${address}/transactions`,
  miniblockDetails: (hash: string) => `/miniblocks/${hash}`
};
