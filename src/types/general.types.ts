import { AccountAssetType, IdentityType } from 'types';

export enum NetworkIdType {
  mainnet = 'mainnet',
  testnet = 'testnet',
  devnet = 'devnet'
}

export enum SortOrderEnum {
  asc = 'asc',
  desc = 'desc'
}

export interface ScamInfoType {
  type: string;
  info: string;
}

export interface RolesType {
  address: string;
  assets?: AccountAssetType;
  roles: string[];
}

export interface BlockType {
  hash: string;
  nonce: number;
  shard: number;
  size: number;
  sizeTxs: number;
  timestamp: number;
  txCount: number;
  validators: string[];
  miniBlocksHashes: string[];
  notarizedBlocksHashes: string[];
  epoch?: number;
  prevHash?: string;
  proposer?: string;
  pubKeyBitmap?: string;
  round?: number;
  stateRootHash?: string;
  isNew?: boolean; // UI flag
  gasConsumed: number;
  gasRefunded: number;
  gasPenalized: number;
  maxGasLimit: number;
  proposerIdentity?: IdentityType;
}

//----------

export interface SliceType {
  isFetched?: boolean;
}

export enum TrendEnum {
  up = 'up',
  down = 'down',
  neutral = 'neutral'
}
