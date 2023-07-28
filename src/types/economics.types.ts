import { SliceType } from 'types/general.types';

export interface EconomicsType {
  totalSupply: number;
  circulatingSupply: number;
  staked: number;
  price: number;
  marketCap: number;
  apr: number;
  topUpApr: number;
  baseApr: number;
  tokenMarketCap: number;
}

export interface EconomicsSliceType extends SliceType {
  unprocessed: EconomicsType;

  totalSupply: string;
  circulatingSupply: string;
  staked: string;
  price: string;
  marketCap: string;
  apr: string;
  topUpApr: string;
  baseApr: string;
  tokenMarketCap: string;

  totalStakedPercent: string;
  ecosystemMarketCap: string;
}
