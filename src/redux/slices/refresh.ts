import { createSlice } from '@reduxjs/toolkit';

export type RefreshSliceType = {
  refresh: {
    timestamp: number;
    poolingTimestamp: number;
  };
};

export function getInitialRefreshState(): RefreshSliceType {
  return {
    refresh: {
      timestamp: Date.now(),
      poolingTimestamp: Date.now()
    }
  };
}

export const refreshSlice = createSlice({
  name: 'refreshSlice',
  initialState: getInitialRefreshState(),
  reducers: {
    triggerRefresh: (state: RefreshSliceType) => {
      state.refresh.timestamp = Date.now();
    },
    triggerPoolingRefresh: (state: RefreshSliceType) => {
      state.refresh.poolingTimestamp = Date.now();
    }
  }
});

export const { triggerRefresh, triggerPoolingRefresh } = refreshSlice.actions;

export const refreshReducer = refreshSlice.reducer;
