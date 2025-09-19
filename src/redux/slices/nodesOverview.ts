import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { processNodesOverview } from 'helpers';
import {
  NodesOverviewSliceType,
  NodesOverviewAddSliceType
} from 'types/node.types';

export const getInitialNodesOverviewState = (): NodesOverviewSliceType => {
  return {
    nodes: [],
    nodeDetails: {},
    isDataReady: undefined
  };
};

export const nodesOverviewSlice = createSlice({
  name: 'nodesOverviewSlice',
  initialState: getInitialNodesOverviewState(),
  reducers: {
    setNodesOverview: (
      state: NodesOverviewSliceType,
      action: PayloadAction<NodesOverviewSliceType>
    ) => {
      state.nodes = processNodesOverview(action.payload.nodes);
      state.isDataReady = action.payload.isDataReady;
    },
    addNodeDetails: (
      state: NodesOverviewSliceType,
      action: PayloadAction<NodesOverviewAddSliceType>
    ) => {
      state.nodeDetails = {
        ...state.nodeDetails,
        [action.payload.nodeDetails.bls]: action.payload.nodeDetails
      };
    }
  }
});

export const { setNodesOverview, addNodeDetails } = nodesOverviewSlice.actions;

export const nodesOverviewReducer = nodesOverviewSlice.reducer;
