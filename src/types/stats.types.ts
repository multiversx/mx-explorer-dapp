import { SliceType } from 'types/general.types';

export interface StatsType {
  shards: number;
  blocks: number;
  accounts: number;
  transactions: number;
  scResults: number;
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

export interface ProcessedStatsType {
  shards: string;
  blocks: string;
  accounts: string;
  transactions: string;
  scResults: string;
  refreshRate: number;
  epoch: number;
  roundsPassed: number;
  roundsPerEpoch: number;

  epochPercentage: number;
  epochTotalTime: string;
  epochTimeElapsed: string;
  epochTimeRemaining: string;
}

export interface StatsSliceType extends SliceType {
  unprocessed: ExtendedStatsType;
  stats: ProcessedStatsType;
  isWebsocket: boolean;
}
