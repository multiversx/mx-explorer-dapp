import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ELLIPSIS } from 'appConstants';
import { GrowthStakingSliceType } from 'types';

export const getInitialGrowthStakingState = (): GrowthStakingSliceType => {
  return {
    totalStaked: ELLIPSIS,
    stakingPercentage: ELLIPSIS,
    circulatingSupply: ELLIPSIS,
    usersStaking: ELLIPSIS,
    averageAPR: ELLIPSIS,

    totalStaked7d: [],
    totalStaked30d: [],
    totalStakedAll: [],

    unprocessed: {
      totalStaked: 0,
      stakingPercentage: 0,
      circulatingSupply: 0,
      usersStaking: 0,
      averageAPR: 0
    },
    isDataReady: false
  };
};

export const growthStakingSlice = createSlice({
  name: 'growthStakingSlice',
  initialState: getInitialGrowthStakingState(),
  reducers: {
    setGrowthStaking: (
      state: GrowthStakingSliceType,
      action: PayloadAction<GrowthStakingSliceType>
    ) => {
      state.totalStaked = action.payload.totalStaked;
      state.stakingPercentage = action.payload.stakingPercentage;
      state.circulatingSupply = action.payload.circulatingSupply;
      state.usersStaking = action.payload.usersStaking;
      state.averageAPR = action.payload.averageAPR;
      state.totalStaked7d = action.payload.totalStaked7d;
      state.totalStaked30d = action.payload.totalStaked30d;
      state.totalStakedAll = action.payload.totalStakedAll;

      state.unprocessed = action.payload.unprocessed;
      state.isDataReady = action.payload.isDataReady;
    }
  }
});

export const { setGrowthStaking } = growthStakingSlice.actions;

export const growthStakingReducer = growthStakingSlice.reducer;
