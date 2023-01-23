import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GlobalStakeType } from 'types/globalStake.types';

export const getInitialGlobalStakeState = (): GlobalStakeType => {
  return {
    queueSize: 0,
  };
};

export const globalStakeSlice = createSlice({
  name: 'globalStakeSlice',
  initialState: getInitialGlobalStakeState(),
  reducers: {
    setGlobalStake: (state: GlobalStakeType, action: PayloadAction<GlobalStakeType>) => {
      state.queueSize = action.payload.queueSize;
      state.waitingList = action.payload.waitingList;
      state.deliquentStake = action.payload.deliquentStake;
      state.nodesVerions = action.payload.nodesVerions;
    },
  },
});

export const { setGlobalStake } = globalStakeSlice.actions;

export const globalStakeReducer = globalStakeSlice.reducer;
