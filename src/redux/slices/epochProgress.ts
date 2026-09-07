import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type EpochProgressSliceType = {
  roundsLeft: number;
};

export function getInitialEpochProgressState(): EpochProgressSliceType {
  return {
    roundsLeft: 0
  };
}

export const epochProgressSlice = createSlice({
  name: 'epochProgressSlice',
  initialState: getInitialEpochProgressState(),
  reducers: {
    setEpochRoundsLeft: (
      state: EpochProgressSliceType,
      action: PayloadAction<number>
    ) => {
      if (state.roundsLeft !== action.payload) {
        state.roundsLeft = action.payload;
      }
    },
    resetEpochRoundsLeft: (state: EpochProgressSliceType) => {
      state.roundsLeft = 0;
    }
  }
});

export const { setEpochRoundsLeft, resetEpochRoundsLeft } =
  epochProgressSlice.actions;

export const epochProgressReducer = epochProgressSlice.reducer;
