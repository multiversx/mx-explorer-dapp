import { SortOrderEnum } from 'types';

export interface BaseApiType {
  page?: number;
  size?: number;
  fields?: string;
  extract?: string;
}

export interface SortableApiType extends BaseApiType {
  sort?: string;
  order?: SortOrderEnum;
}

export interface GetAccountsType extends SortableApiType {
  ownerAddress?: string;
  isSmartContract?: boolean;
  withOwnerAssets?: boolean;
}
export interface GetBlocksType extends BaseApiType {
  shard?: number;
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

export interface GetNftsType extends BaseApiType {
  search?: string;
  identifiers?: string;
  type?: string;
  collections?: string;
  name?: string;
  tags?: string;
  creator?: string;
  hasUris?: string;
  includeFlagged?: boolean;
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
  pagination?: boolean;
  provider?: string;
  fullHistory?: string;
}

export interface GetTransactionsType extends SortableApiType {
  address?: string;
  senderShard?: number;
  receiverShard?: number;
  sender?: string;
  receiver?: string;
  method?: string;
  before?: number;
  after?: number;
  status?: string;
  miniBlockHash?: string;
  search?: string;
  token?: string;
  withUsername?: boolean;
}

export interface GetProvidersType extends BaseApiType {
  identity?: string;
  providers?: string;
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
    withUsername?: boolean;
    includeMetaESDT?: boolean;
    withGuardianInfo?: boolean;
    isSmartContract?: boolean;
    withOwnerAssets?: boolean;
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
