import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { MAX_CACHED_NODE_DETAILS } from 'appConstants';
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
      const { bls } = action.payload.nodeDetails;
      const nodeDetails = state.nodeDetails ?? {};

      delete nodeDetails[bls];
      nodeDetails[bls] = action.payload.nodeDetails;

      const keys = Object.keys(nodeDetails);
      if (keys.length > MAX_CACHED_NODE_DETAILS) {
        keys
          .slice(0, keys.length - MAX_CACHED_NODE_DETAILS)
          .forEach((key) => delete nodeDetails[key]);
      }

      state.nodeDetails = nodeDetails;
    }
  }
});

export const { setNodesOverview, addNodeDetails } = nodesOverviewSlice.actions;

export const nodesOverviewReducer = nodesOverviewSlice.reducer;
