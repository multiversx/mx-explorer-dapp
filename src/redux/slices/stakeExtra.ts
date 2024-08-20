import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ELLIPSIS } from 'appConstants';
import { StakeExtraSliceType } from 'types/stake.types';

export const getInitialStakeExtraState = (): StakeExtraSliceType => {
  return {
    totalNodes: ELLIPSIS,
    totalValidatorNodes: ELLIPSIS,
    totalIdentityNodes: ELLIPSIS,

    unprocessed: {
      totalNodes: 0,
      totalValidatorNodes: 0,
      totalIdentityNodes: 0
    },
    isFetched: false
  };
};

export const stakeExtraSlice = createSlice({
  name: 'stakeExtraSlice',
  initialState: getInitialStakeExtraState(),
  reducers: {
    setStakeExtra: (
      state: StakeExtraSliceType,
      action: PayloadAction<StakeExtraSliceType>
    ) => {
      state.totalNodes = action.payload.totalNodes;
      state.totalValidatorNodes = action.payload.totalValidatorNodes;
      state.totalIdentityNodes = action.payload.totalIdentityNodes;

      state.unprocessed = action.payload.unprocessed;
      state.isFetched = action.payload.isFetched;
    }
  }
});

export const { setStakeExtra } = stakeExtraSlice.actions;

export const stakeExtraReducer = stakeExtraSlice.reducer;
