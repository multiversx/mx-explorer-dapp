import {
  AccountType,
  BlockType,
  CollectionType,
  MiniBlockType,
  NftType,
  NodeType,
  TokenType,
  TransactionInPoolType,
  TransactionSCResultType,
  TransactionType
} from 'types';

// single response - hashes or tokens
export interface SearchSingleResponseType {
  account?: AccountType;
  token?: TokenType;
  collection?: CollectionType;
  nft?: NftType;
  node?: NodeType;
  block?: BlockType;
  miniblock?: MiniBlockType;
  transaction?: TransactionType;
  scResult?: TransactionSCResultType;
  transactionInPool?: TransactionInPoolType;
}

export interface SearchResponseType extends SearchSingleResponseType {
  searchedValue?: string;
  accounts?: AccountType[];
  tokens?: TokenType[];
  collections?: CollectionType[];
  nfts?: NftType[];
  nodes?: NodeType[];
}
