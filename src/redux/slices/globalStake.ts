import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ELLIPSIS } from 'appConstants';
import { GlobalStakeSliceType } from 'types/globalStake.types';

export const getInitialGlobalStakeState = (): GlobalStakeSliceType => {
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

export const globalStakeSlice = createSlice({
  name: 'globalStakeSlice',
  initialState: getInitialGlobalStakeState(),
  reducers: {
    setGlobalStake: (
      state: GlobalStakeSliceType,
      action: PayloadAction<GlobalStakeSliceType>
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

export const { setGlobalStake } = globalStakeSlice.actions;

export const globalStakeReducer = globalStakeSlice.reducer;
