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
