import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ELLIPSIS } from 'appConstants';
import { GrowthHeroSliceType } from 'types/growthWidgets';

export const getInitialGrowthHeroState = (): GrowthHeroSliceType => {
  return {
    totalTransactions: ELLIPSIS,
    totalTransactionsToday: ELLIPSIS,
    totalAccounts: ELLIPSIS,
    activeAccountsToday: ELLIPSIS,

    unprocessed: {
      totalTransactions: 0,
      totalTransactionsToday: 0,
      totalAccounts: 0,
      activeAccountsToday: 0
    },
    isDataReady: false
  };
};

export const growthHeroSlice = createSlice({
  name: 'growthHeroSlice',
  initialState: getInitialGrowthHeroState(),
  reducers: {
    setGrowthHero: (
      state: GrowthHeroSliceType,
      action: PayloadAction<GrowthHeroSliceType>
    ) => {
      state.totalTransactions = action.payload.totalTransactions;
      state.totalTransactionsToday = action.payload.totalTransactionsToday;
      state.totalAccounts = action.payload.totalAccounts;
      state.activeAccountsToday = action.payload.activeAccountsToday;

      state.unprocessed = action.payload.unprocessed;
      state.isDataReady = action.payload.isDataReady;
    }
  }
});

export const { setGrowthHero } = growthHeroSlice.actions;

export const growthHeroReducer = growthHeroSlice.reducer;
