import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GrowthMostUsedSliceType } from 'types/growthWidgets';

export const getInitialGrowthMostUsedState = (): GrowthMostUsedSliceType => {
  return {
    dailyMostUsedApplications: [],
    dailyMostTransactedNFTs: [],
    dailyMostTransactedTokens: [],

    isDataReady: false
  };
};

export const growthMostUsedSlice = createSlice({
  name: 'growthMostUsedSlice',
  initialState: getInitialGrowthMostUsedState(),
  reducers: {
    setGrowthMostUsed: (
      state: GrowthMostUsedSliceType,
      action: PayloadAction<GrowthMostUsedSliceType>
    ) => {
      state.dailyMostUsedApplications =
        action.payload.dailyMostUsedApplications;
      state.dailyMostTransactedNFTs = action.payload.dailyMostTransactedNFTs;
      state.dailyMostTransactedTokens =
        action.payload.dailyMostTransactedTokens;

      state.isDataReady = action.payload.isDataReady;
    }
  }
});

export const { setGrowthMostUsed } = growthMostUsedSlice.actions;

export const growthMostUsedReducer = growthMostUsedSlice.reducer;
