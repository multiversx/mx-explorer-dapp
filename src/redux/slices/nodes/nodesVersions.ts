import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NodesVersionsSliceType } from 'types/nodesVersions.types';

export const getInitialNodesVersionsState = (): NodesVersionsSliceType => {
  return {
    unprocessed: {},

    nodesVersions: [],
    isDataReady: false
  };
};

export const nodesVersionsSlice = createSlice({
  name: 'nodesVersionsSlice',
  initialState: getInitialNodesVersionsState(),
  reducers: {
    setNodesVersions: (
      state: NodesVersionsSliceType,
      action: PayloadAction<NodesVersionsSliceType>
    ) => {
      state.nodesVersions = action.payload.nodesVersions;

      state.unprocessed = action.payload.unprocessed;
      state.isDataReady = action.payload.isDataReady;
    }
  }
});

export const { setNodesVersions } = nodesVersionsSlice.actions;

export const nodesVersionsReducer = nodesVersionsSlice.reducer;
