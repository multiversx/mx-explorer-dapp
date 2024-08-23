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
    isNodeCountFetched: false,
    isNodesIdentityCountFetched: false
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
      if (action.payload.totalNodes !== undefined) {
        state.totalNodes = action.payload.totalNodes;
      }
      if (action.payload.totalValidatorNodes !== undefined) {
        state.totalValidatorNodes = action.payload.totalValidatorNodes;
      }
      if (action.payload.totalIdentityNodes !== undefined) {
        state.totalIdentityNodes = action.payload.totalIdentityNodes;
      }

      if (action.payload.isNodeCountFetched !== undefined) {
        state.isNodeCountFetched = action.payload.isNodeCountFetched;
      }
      if (action.payload.isNodesIdentityCountFetched !== undefined) {
        state.isNodesIdentityCountFetched =
          action.payload.isNodesIdentityCountFetched;
      }

      state.unprocessed = action.payload.unprocessed;
    }
  }
});

export const { setStakeExtra } = stakeExtraSlice.actions;

export const stakeExtraReducer = stakeExtraSlice.reducer;
