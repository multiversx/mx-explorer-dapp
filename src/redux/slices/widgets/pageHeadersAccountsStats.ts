import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HeadersAccountsType } from 'types';

export const getInitialHeaderAccountsStatsState = (): HeadersAccountsType => {
  return {};
};

export const pageHeadersAccountsStatsSlice = createSlice({
  name: 'pageHeadersAccountsStatsSlice',
  initialState: getInitialHeaderAccountsStatsState(),
  reducers: {
    setPageHeaderAccountsStats: (
      state: HeadersAccountsType,
      action: PayloadAction<HeadersAccountsType>
    ) => {
      state.totalAccounts = action.payload.totalAccounts;
      // state.newAccountsToday = action.payload.newAccountsToday;
      state.usersStaking = action.payload.usersStaking;
      state.activeAccountsToday = action.payload.activeAccountsToday;
    },
    setPageHeaderAccountStatsTotalAccounts: (
      state: HeadersAccountsType,
      action: PayloadAction<number | string>
    ) => {
      state.totalAccounts = action.payload;
    }
  }
});

export const {
  setPageHeaderAccountsStats,
  setPageHeaderAccountStatsTotalAccounts
} = pageHeadersAccountsStatsSlice.actions;

export const pageHeadersAccountsReducer = pageHeadersAccountsStatsSlice.reducer;
