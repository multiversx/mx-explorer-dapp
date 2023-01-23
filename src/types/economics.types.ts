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

export interface EconomicsSliceType extends EconomicsType {
  economicsFetched: boolean;
  totalStakedPercent: number;
  ecosystemMarketCap: number;
}
