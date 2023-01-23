import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GlobalStakeSliceType } from 'types/globalStake.types';

export const getInitialGlobalStakeState = (): GlobalStakeSliceType => {
  return {
    queueSize: 0,

    globalStakeFetched: false,
  };
};

export const globalStakeSlice = createSlice({
  name: 'globalStakeSlice',
  initialState: getInitialGlobalStakeState(),
  reducers: {
    setGlobalStake: (state: GlobalStakeSliceType, action: PayloadAction<GlobalStakeSliceType>) => {
      state.queueSize = action.payload.queueSize;
      state.waitingList = action.payload.waitingList;
      state.deliquentStake = action.payload.deliquentStake;
      state.nodesVerions = action.payload.nodesVerions;

      state.globalStakeFetched = action.payload.globalStakeFetched;
    },
  },
});

export const { setGlobalStake } = globalStakeSlice.actions;

export const globalStakeReducer = globalStakeSlice.reducer;
