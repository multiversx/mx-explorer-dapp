import { ELLIPSIS } from 'appConstants';
import { SliceType } from './general.types';

export interface EventType {
  txHash: string;
  logAddress: string;
  identifier: string;
  address: string;
  data: string;
  topics: string[];
  shardID: number;
  additionalData: string[];
  txOrder: number;
  order: number;
  timestamp: number;
}

export interface UIEventType extends EventType {
  isNew?: boolean; // UI flag
}

export interface EventsSliceType extends SliceType {
  events: UIEventType[];
  eventsCount: number | typeof ELLIPSIS;
}

export enum TransactionEventIdentifiersEnum {
  ESDTNFTTransfer = 'ESDTNFTTransfer',
  ESDTNFTBurn = 'ESDTNFTBurn',
  ESDTNFTAddQuantity = 'ESDTNFTAddQuantity',
  ESDTNFTCreate = 'ESDTNFTCreate',
  MultiESDTNFTTransfer = 'MultiESDTNFTTransfer',
  ESDTTransfer = 'ESDTTransfer',
  ESDTBurn = 'ESDTBurn',
  ESDTLocalMint = 'ESDTLocalMint',
  ESDTLocalBurn = 'ESDTLocalBurn',
  ESDTWipe = 'ESDTWipe',
  ESDTFreeze = 'ESDTFreeze',
  transferValueOnly = 'transferValueOnly',
  writeLog = 'writeLog',
  signalError = 'signalError'
}
