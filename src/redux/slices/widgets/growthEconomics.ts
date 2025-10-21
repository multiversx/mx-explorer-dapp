import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ELLIPSIS } from 'appConstants';
import { GrowthEconomicsSliceType } from 'types';

export const getInitialGrowthEconomicsState = (): GrowthEconomicsSliceType => {
  return {
    developerRewards: ELLIPSIS,
    feesCaptured: ELLIPSIS,
    applicationsDeployed: ELLIPSIS,

    unprocessed: {
      developerRewards: 0,
      feesCaptured: 0,
      applicationsDeployed: 0
    },
    isDataReady: false
  };
};

export const growthEconomicsSlice = createSlice({
  name: 'growthEconomicsSlice',
  initialState: getInitialGrowthEconomicsState(),
  reducers: {
    setGrowthEconomics: (
      state: GrowthEconomicsSliceType,
      action: PayloadAction<GrowthEconomicsSliceType>
    ) => {
      state.developerRewards = action.payload.developerRewards;
      state.feesCaptured = action.payload.feesCaptured;
      state.applicationsDeployed = action.payload.applicationsDeployed;

      state.unprocessed = action.payload.unprocessed;
      state.isDataReady = action.payload.isDataReady;
    }
  }
});

export const { setGrowthEconomics } = growthEconomicsSlice.actions;

export const growthEconomicsReducer = growthEconomicsSlice.reducer;
