import { AccountAssetType } from './account.types';

export enum ApplicationSortEnum {
  balance = 'balance',
  transfersLast24h = 'transfersLast24h',
  timestamp = 'timestamp'
}

export interface ApplicationType {
  address: string;
  balance: string;
  usersCount: number;
  feesCaptured: string;
  developerReward: string;
  deployedAt: number;
  deployTxHash: string;
  isVerified: boolean;
  txCount: number;
  assets?: AccountAssetType;
}
