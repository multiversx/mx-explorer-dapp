import { SortOrderEnum, TransactionInPoolTypeEnum } from 'types';

export enum NetworkAdapterEnum {
  api = 'api',
  elastic = 'elastic'
}

export interface BaseApiType {
  page?: number;
  size?: number;
  fields?: string;
  extract?: string;
  // not on api
  isCount?: boolean;
}

export interface SortableApiType extends BaseApiType {
  sort?: string;
  order?: SortOrderEnum;
}

export interface GetAccountType {
  address: string;
  withGuardianInfo?: boolean;
  withTxCount?: boolean;
  withScrCount?: boolean;
  withAssets?: boolean;
}

export interface GetAccountsType extends SortableApiType {
  search?: string;
  name?: string;
  ownerAddress?: string;
  isSmartContract?: boolean;
  withOwnerAssets?: boolean;
  withDeployInfo?: boolean;
  withTxCount?: boolean;
  withScrCount?: boolean;
  withAssets?: boolean;
}
export interface GetBlocksType extends BaseApiType {
  shard?: number;
  nonce?: number;
  epoch?: number;
  proposer?: string;
  withProposerIdentity?: boolean;
}

export interface GetTokensType extends SortableApiType {
  type?: string;
  search?: string;
  name?: string;
  identifier?: string;
  identifiers?: string;
  includeMetaESDT?: boolean;
  withUsername?: boolean;
}

export interface GetNftsType extends SortableApiType {
  search?: string;
  identifiers?: string;
  type?: string;
  collections?: string;
  name?: string;
  tags?: string;
  creator?: string;
  hasUris?: string;
  includeFlagged?: boolean;
  withOwner?: boolean;
  withSupply?: boolean;
  withScamInfo?: boolean;
  excludeMetaESDT?: boolean;
  source?: string;
}

export interface GetCollectionsType extends SortableApiType {
  search?: string;
  identifiers?: string;
  type?: string;
  before?: string;
  after?: string;
  excludeMetaESDT?: boolean;
  withOwner?: boolean;
}

export interface GetNodesType extends SortableApiType {
  search?: string;
  issues?: string;
  online?: boolean;
  type?: string;
  shard?: string;
  status?: string;
  count?: boolean;
  identity?: string;
  provider?: string;
  fullHistory?: string;
  from?: number;
  isQualified?: boolean;
  isAuctioned?: boolean;
  isAuctionDangerZone?: boolean;
  owner?: string;
  withIdentityInfo?: boolean;
}

export interface GetIdentitiesType extends SortableApiType {
  identities?: string;
}

export interface GetTransactionsType extends SortableApiType {
  sender?: string;
  receiver?: string;
  senderOrReceiver?: string;
  address?: string;
  senderShard?: number;
  receiverShard?: number;
  method?: string;
  before?: number;
  after?: number;
  status?: string;
  miniBlockHash?: string;
  search?: string;
  token?: string;
  hashes?: string;
  relayer?: string;
  withScResults?: boolean;
  withOperations?: boolean;
  withLogs?: boolean;
  withScamInfo?: boolean;
  withUsername?: boolean;
  withBlockInfo?: boolean;
  withTxsRelayedByAddress?: boolean;
  withCrossChainTransfers?: boolean;
  isRelayed?: boolean;
}

export interface GetTransactionsInPoolType extends SortableApiType {
  sender?: string;
  receiver?: string;
  senderShard?: number;
  receiverShard?: number;
  type?: TransactionInPoolTypeEnum;
}

export interface GetEventsType extends BaseApiType {
  address?: string;
  identifier?: string;
  txHash?: string;
  shard?: number;
  before?: number;
  after?: number;
}

export interface GetProvidersType extends BaseApiType {
  identity?: string;
  providers?: string;
  withIdentityInfo?: boolean;
}

export type AdapterProviderType = (
  props: AdapterProviderPropsType & { url: string }
) => Promise<any>;

export interface AdapterProviderPropsType {
  baseUrl: string;
  proxyUrl?: string;
  metaChainShardId?: number;
  url?: string;
  params?: {
    nonce?: number;
    shard?: number;
    epoch?: number;
    proposer?: string;
    miniBlockHash?: string;
    sender?: string;
    receiver?: string;
    senderOrReceiver?: string;
    condition?: string;
    senderShard?: number;
    receiverShard?: number;
    signersIndexes?: number;
    round?: number;
    from?: number;
    page?: number;
    size?: number;
    search?: string;
    issues?: string;
    status?: string;
    type?: string;
    validator?: string;
    fields?: any;
    identity?: string;
    identities?: string;
    provider?: string;
    sort?: string;
    order?: SortOrderEnum;
    online?: boolean;
    collection?: string;
    identifier?: string;
    identifiers?: string;
    includeFlagged?: boolean;
    fullHistory?: string;
    withScResults?: boolean;
    withOperations?: boolean;
    withLogs?: boolean;
    withScamInfo?: boolean;
    withUsername?: boolean;
    withBlockInfo?: boolean;
    isRelayed?: boolean;
    includeMetaESDT?: boolean;
    withGuardianInfo?: boolean;
    isSmartContract?: boolean;
    withOwnerAssets?: boolean;
    withDeployInfo?: boolean;
    withTxCount?: boolean;
    withScrCount?: boolean;
    withIdentityInfo?: boolean;
    owner?: string;
  };
  timeout: number;
  timestamp?: number;
}

export type ApiAdapterResponseType =
  | {
      data: any;
      success: boolean;
    }
  | {
      success: boolean;
      data?: undefined;
    };
