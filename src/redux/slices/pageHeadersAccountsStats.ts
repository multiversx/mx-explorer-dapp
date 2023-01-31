import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HeadersAccountsType } from '../../types/headerStats.types';

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
      state.accountsBalanceGt1000 = action.payload.accountsBalanceGt1000;
      state.usersStaking = action.payload.usersStaking;
      state.activeAccountsToday = action.payload.activeAccountsToday;
    }
  }
});

export const { setPageHeaderAccountsStats } =
  pageHeadersAccountsStatsSlice.actions;

export const pageHeadersAccountsReducer = pageHeadersAccountsStatsSlice.reducer;
