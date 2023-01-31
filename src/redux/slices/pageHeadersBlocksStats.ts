import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  HeadersBlocksType,
  PageHeaderStatsType
} from '../../types/headerStats.types';

export const getInitialHeaderBlocksStatsState = (): HeadersBlocksType => {
  return {
    // blockHeight: 0,
    // totalNetworkFees: 0,
    // totalDeveloperRewards: 0,
    // totalApplicationsDeployed: 0
  };
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
    }
  }
});

export const { setPageHeaderBlocksStats } = pageHeadersBlocksStatsSlice.actions;

export const pageHeadersBlocksReducer = pageHeadersBlocksStatsSlice.reducer;
