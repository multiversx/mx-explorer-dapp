import { SliceType } from 'types/general.types';

export interface GrowthHeroType {
  totalTransactions: number;
  totalTransactionsToday: number;
  totalAccounts: number;
  activeAccountsToday: number;
}

export interface GrowthHeroSliceType extends SliceType {
  unprocessed: GrowthHeroType;

  totalTransactions: string;
  totalTransactionsToday: string;
  totalAccounts: string;
  activeAccountsToday: string;
}
