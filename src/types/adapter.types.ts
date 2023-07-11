export interface GetBlocksType {
  page?: number;
  size?: number;
  shard?: number;
  epoch?: number;
  proposer?: string;
  withProposerIdentity?: boolean;
}

export interface GetTokensType {
  fields?: string;
  page?: number;
  size?: number;
  type?: string;
  search?: string;
  name?: string;
  identifier?: string;
  identifiers?: string;
  sort?: string;
  order?: string;
  includeMetaESDT?: boolean;
  withUsername?: boolean;
}

export interface GetNftsType {
  page?: number;
  size?: number;
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

export interface GetCollectionsType {
  fields?: string;
  page?: number;
  size?: number;
  search?: string;
  identifiers?: string;
  type?: string;
  before?: string;
  after?: string;
  sort?: string;
  excludeMetaESDT?: boolean;
}

export interface GetNodesType {
  search?: string;
  issues?: string;
  online?: boolean;
  type?: string;
  shard?: string;
  status?: string;
  count?: boolean;
  page?: number;
  size?: number;
  identity?: string;
  sort?: string;
  order?: string;
  pagination?: boolean;
  provider?: string;
  fullHistory?: string;
}

export interface GetTransactionsType {
  page?: number;
  size?: number;
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

export interface GetProvidersType {
  identity?: string;
  providers?: string;
  fields?: string;
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
    order?: string;
    online?: boolean;
    collection?: string;
    identifier?: string;
    identifiers?: string;
    includeFlagged?: boolean;
    fullHistory?: string;
    withUsername?: boolean;
    includeMetaESDT?: boolean;
    withGuardianInfo?: boolean;
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
