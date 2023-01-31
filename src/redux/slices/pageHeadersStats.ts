import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PageHeaderStatsType } from '../../types/headerStats.types';

export const getInitialHeaderStatsState = (): PageHeaderStatsType => {
  return {};
};

export const pageHeadersStatsSlice = createSlice({
  name: 'pageHeadersStatsSlice',
  initialState: getInitialHeaderStatsState(),
  reducers: {
    setPageHeaderStats: (
      state: PageHeaderStatsType,
      action: PayloadAction<PageHeaderStatsType>
    ) => {
      state.blocks = action.payload.blocks;
      state.tokens = action.payload.tokens;
      state.accounts = action.payload.accounts;
      state.collections = action.payload.collections;
    }
  }
});

export const { setPageHeaderStats } = pageHeadersStatsSlice.actions;

export const pageHeadersReducer = pageHeadersStatsSlice.reducer;
