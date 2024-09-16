import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ELLIPSIS } from 'appConstants';
import { StatsSliceType } from 'types/stats.types';

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
  };
};

export const statsSlice = createSlice({
  name: 'statsSlice',
  initialState: getInitialStatsState(),
  reducers: {
    setStats: (
      state: StatsSliceType,
      action: PayloadAction<StatsSliceType>
    ) => {
      state.isFetched = action.payload.isFetched;
      state.unprocessed = action.payload.unprocessed;

      state.shards = action.payload.shards;
      state.blocks = action.payload.blocks;
      state.accounts = action.payload.accounts;
      state.transactions = action.payload.transactions;
      state.scResults = action.payload.scResults;
      state.refreshRate = action.payload.refreshRate;
      state.epoch = action.payload.epoch;
      state.roundsPassed = action.payload.roundsPassed;
      state.roundsPerEpoch = action.payload.roundsPerEpoch;

      state.epochPercentage = action.payload.epochPercentage;
      state.epochTotalTime = action.payload.epochTotalTime;
      state.epochTimeElapsed = action.payload.epochTimeElapsed;
      state.epochTimeRemaining = action.payload.epochTimeRemaining;
    }
  }
});

export const { setStats } = statsSlice.actions;

export const statsReducer = statsSlice.reducer;
