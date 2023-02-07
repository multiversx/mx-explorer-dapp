export interface GetBlocksType {
  size?: number;
  shard?: number;
  epoch?: number;
  proposer?: string;
  withProposerIdentity?: boolean;
}

export interface GetTokensType {
  search?: string;
  size?: number;
  type?: string;
  identifiers?: string;
  sort?: string;
  order?: string;
  withUsername?: boolean;
}

export interface GetNftsType {
  collection?: string;
  identifier?: string;
  search?: string;
  size?: number;
  type?: string;
  collections?: string;
  identifiers?: string;
  includeFlagged?: boolean;
  sort?: string;
}

export interface GetNodesType {
  search?: string;
  issues?: string;
  online?: boolean;
  type?: string;
  shard?: string;
  status?: string;
  count?: boolean;
  size?: number;
  identity?: string;
  sort?: string;
  order?: string;
  pagination?: boolean;
  provider?: string;
  fullHistory?: string;
}

export interface GetTransactionsType {
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
    includeFlagged?: boolean;
    fullHistory?: string;
    withUsername?: boolean;
    includeMetaESDT?: boolean;
  };
  timeout: number;
  timestamp?: number;
}
