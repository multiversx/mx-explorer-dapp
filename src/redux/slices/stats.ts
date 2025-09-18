import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ELLIPSIS } from 'appConstants';
import { getExtraStats, processStats } from 'helpers';
import { SliceType } from 'types';
import { StatsSliceType, StatsType } from 'types/stats.types';

interface StatsActionType extends SliceType {
  isWebsocket: boolean;
  stats: StatsType;
}

export const getInitialStatsState = (): StatsSliceType => {
  return {
    isFetched: false,
    unprocessed: {
      shards: 0,
      blocks: 0,
      accounts: 0,
      transactions: 0,
      scResults: 0,
      refreshRate: 0,
      epoch: 0,
      roundsPassed: 0,
      roundsPerEpoch: 0,

      epochPercentage: 0,
      epochTotalTime: 0,
      epochTimeElapsed: 0,
      epochTimeRemaining: 0
    },
    stats: {
      shards: ELLIPSIS,
      blocks: ELLIPSIS,
      accounts: ELLIPSIS,
      transactions: ELLIPSIS,
      scResults: ELLIPSIS,
      refreshRate: 0,
      epoch: 0,
      roundsPassed: 0,
      roundsPerEpoch: 0,

      epochPercentage: 0,
      epochTotalTime: ELLIPSIS,
      epochTimeElapsed: ELLIPSIS,
      epochTimeRemaining: ELLIPSIS
    },
    isWebsocket: false
  };
};

export const statsSlice = createSlice({
  name: 'statsSlice',
  initialState: getInitialStatsState(),
  reducers: {
    setStats: (
      state: StatsSliceType,
      action: PayloadAction<StatsActionType>
    ) => {
      const {
        epochPercentage,
        epochTotalTime,
        epochTimeElapsed,
        epochTimeRemaining
      } = getExtraStats(action.payload.stats);

      const processedStats = processStats(action.payload.stats);

      state.isFetched = action.payload.isFetched;
      state.isWebsocket = action.payload.isWebsocket;

      state.unprocessed = {
        ...action.payload.stats,
        epochPercentage,
        epochTotalTime,
        epochTimeElapsed,
        epochTimeRemaining
      };

      state.stats.shards = processedStats.shards;
      state.stats.blocks = processedStats.blocks;
      state.stats.accounts = processedStats.accounts;
      state.stats.transactions = processedStats.transactions;
      state.stats.scResults = processedStats.scResults;
      state.stats.refreshRate = processedStats.refreshRate;
      state.stats.epoch = processedStats.epoch;
      state.stats.roundsPassed = processedStats.roundsPassed;
      state.stats.roundsPerEpoch = processedStats.roundsPerEpoch;

      state.stats.epochPercentage = processedStats.epochPercentage;
      state.stats.epochTotalTime = processedStats.epochTotalTime;
      state.stats.epochTimeElapsed = processedStats.epochTimeElapsed;
      state.stats.epochTimeRemaining = processedStats.epochTimeRemaining;
    }
  }
});

export const { setStats } = statsSlice.actions;

export const statsReducer = statsSlice.reducer;
