import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  HeadersBlocksType,
  PageHeaderStatsType
} from '../../types/headerStats.types';

export const getInitialHeaderBlocksStatsState = (): HeadersBlocksType => {
  return {};
};

export const pageHeadersBlocksStatsSlice = createSlice({
  name: 'pageHeadersBlocksStatsSlice',
  initialState: getInitialHeaderBlocksStatsState(),
  reducers: {
    setPageHeaderBlocksStats: (
      state: HeadersBlocksType,
      action: PayloadAction<HeadersBlocksType>
    ) => {
      state.blockHeight = action.payload.blockHeight;
      state.totalApplicationsDeployed =
        action.payload.totalApplicationsDeployed;
      state.totalApplicationsDeployed = action.payload.totalDeveloperRewards;
      state.totalDeveloperRewards = action.payload.totalNetworkFees;
    },
    setPageHeaderBlocksStatsBlockHeight: (
      state: HeadersBlocksType,
      action: PayloadAction<number>
    ) => {
      state.blockHeight = action.payload;
    }
  }
});

export const { setPageHeaderBlocksStats, setPageHeaderBlocksStatsBlockHeight } =
  pageHeadersBlocksStatsSlice.actions;

export const pageHeadersBlocksReducer = pageHeadersBlocksStatsSlice.reducer;
