export interface StatsType {
  shards: number;
  blocks: number;
  accounts: number;
  transactions: number;
  refreshRate: number;
  epoch: number;
  roundsPassed: number;
  roundsPerEpoch: number;
}

export interface StatsSliceType extends StatsType {
  statsFetched: boolean;
  epochPercentage: number;
  epochTotalTime: number;
  epochTimeElapsed: number;
  epochTimeRemaining: number;
}
