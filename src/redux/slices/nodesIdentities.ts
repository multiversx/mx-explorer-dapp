import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NodesIdentitiesSliceType } from 'types/node.types';

export const getInitialNodesIdentitiesState = (): NodesIdentitiesSliceType => {
  return {
    unprocessed: [],

    nodesIdentities: [],
    isFetched: undefined
  };
};

export const nodesIdentitiesSlice = createSlice({
  name: 'nodesIdentitiesSlice',
  initialState: getInitialNodesIdentitiesState(),
  reducers: {
    setNodesIdentities: (
      state: NodesIdentitiesSliceType,
      action: PayloadAction<NodesIdentitiesSliceType>
    ) => {
      state.nodesIdentities = action.payload.nodesIdentities;

      state.unprocessed = action.payload.unprocessed;
      state.isFetched = action.payload.isFetched;
    }
  }
});

export const { setNodesIdentities } = nodesIdentitiesSlice.actions;

export const nodesIdentitiesReducer = nodesIdentitiesSlice.reducer;
