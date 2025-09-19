import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ELLIPSIS } from 'appConstants';
import { GrowthTransactionsSliceType } from 'types';

export const getInitialGrowthTransactionsState =
  (): GrowthTransactionsSliceType => {
    return {
      totalTransactions: ELLIPSIS,
      scResults: ELLIPSIS,
      transactions: ELLIPSIS,

      scResults7d: [],
      scResults30d: [],
      scResultsAll: [],
      transactions7d: [],
      transactions30d: [],
      transactionsAll: [],

      unprocessed: {
        totalTransactions: 0,
        scResults: 0,
        transactions: 0
      },
      isDataReady: false
    };
  };

export const growthTransactionsSlice = createSlice({
  name: 'growthTransactionsSlice',
  initialState: getInitialGrowthTransactionsState(),
  reducers: {
    setGrowthTransactions: (
      state: GrowthTransactionsSliceType,
      action: PayloadAction<GrowthTransactionsSliceType>
    ) => {
      state.totalTransactions = action.payload.totalTransactions;
      state.scResults = action.payload.scResults;
      state.transactions = action.payload.transactions;

      state.scResults7d = action.payload.scResults7d;
      state.scResults30d = action.payload.scResults30d;
      state.scResultsAll = action.payload.scResultsAll;
      state.transactions7d = action.payload.transactions7d;
      state.transactions30d = action.payload.transactions30d;
      state.transactionsAll = action.payload.transactionsAll;

      state.unprocessed = action.payload.unprocessed;
      state.isDataReady = action.payload.isDataReady;
    }
  }
});

export const { setGrowthTransactions } = growthTransactionsSlice.actions;

export const growthTransactionsReducer = growthTransactionsSlice.reducer;
