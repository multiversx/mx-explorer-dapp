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

export interface EconomicsSliceType {
  isFetched: boolean;
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
