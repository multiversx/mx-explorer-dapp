import { createSlice } from '@reduxjs/toolkit';

export type RefreshSliceType = {
  refresh: {
    timestamp: number;
  };
};

export function getInitialRefreshState(): RefreshSliceType {
  return {
    refresh: {
      timestamp: Date.now()
    }
  };
}

export const refreshSlice = createSlice({
  name: 'refreshSlice',
  initialState: getInitialRefreshState(),
  reducers: {
    triggerRefresh: (state: RefreshSliceType) => {
      state.refresh = { timestamp: Date.now() };
    }
  }
});

export const { triggerRefresh } = refreshSlice.actions;

export const refreshReducer = refreshSlice.reducer;
