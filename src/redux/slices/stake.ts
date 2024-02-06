import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ELLIPSIS } from 'appConstants';
import { StakeSliceType } from 'types/stake.types';

export const getInitialStakeState = (): StakeSliceType => {
  return {
    totalValidators: ELLIPSIS,
    activeValidators: ELLIPSIS,
    queueSize: ELLIPSIS,
    totalStaked: ELLIPSIS,

    unprocessed: {
      totalValidators: 0,
      activeValidators: 0,
      queueSize: 0,
      totalStaked: ELLIPSIS
    },
    isFetched: false
  };
};

export const stakeSlice = createSlice({
  name: 'stakeSlice',
  initialState: getInitialStakeState(),
  reducers: {
    setStake: (
      state: StakeSliceType,
      action: PayloadAction<StakeSliceType>
    ) => {
      state.totalValidators = action.payload.totalValidators;
      state.activeValidators = action.payload.activeValidators;
      state.queueSize = action.payload.queueSize;
      state.totalStaked = action.payload.totalStaked;

      state.unprocessed = action.payload.unprocessed;
      state.isFetched = action.payload.isFetched;
    }
  }
});

export const { setStake } = stakeSlice.actions;

export const stakeReducer = stakeSlice.reducer;
