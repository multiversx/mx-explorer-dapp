import { SliceType, TrendEnum } from 'types/general.types';

export interface GrowthSearchType {
  currentPrice: number;
  priceChange24h: number;
  activeAccountsToday: number;
}

export interface GrowthSearchSliceType extends SliceType {
  unprocessed: GrowthSearchType;

  currentPrice: string;
  priceChange24h: string;
  activeAccountsToday: string;
  priceChangeTrend: TrendEnum;
}
