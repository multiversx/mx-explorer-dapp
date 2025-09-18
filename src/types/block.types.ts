import { ELLIPSIS } from 'appConstants';
import { SliceType } from './general.types';
import { IdentityType } from './node.types';

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
  gasConsumed: number;
  gasRefunded: number;
  gasPenalized: number;
  maxGasLimit: number;
  proposerIdentity?: IdentityType;
}

export interface UIBlockType extends BlockType {
  isNew?: boolean; // UI flag
  nextHash?: string;
}

export enum BlockFiltersEnum {
  shard = 'shard'
}

export interface BlocksSliceType extends SliceType {
  blocks: UIBlockType[];
  blocksCount: number | typeof ELLIPSIS;
  isWebsocket: boolean;
  isDataReady: boolean | undefined;
}
