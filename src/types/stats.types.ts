import { SliceType } from 'types/general.types';

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

export interface ExtendedStatsType extends StatsType {
  epochPercentage: number;
  epochTotalTime: number;
  epochTimeElapsed: number;
  epochTimeRemaining: number;
}

export interface StatsSliceType extends SliceType {
  unprocessed: ExtendedStatsType;

  shards: string;
  blocks: string;
  accounts: string;
  transactions: string;
  refreshRate: number;
  epoch: string;
  roundsPassed: string;
  roundsPerEpoch: string;

  epochPercentage: string;
  epochTotalTime: string;
  epochTimeElapsed: string;
  epochTimeRemaining: string;
}
