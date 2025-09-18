import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ELLIPSIS } from 'appConstants';
import { BlocksSliceType, BlockType } from 'types';

export const getInitialBlocksState = (): BlocksSliceType => {
  return {
    blocks: [],
    blocksCount: ELLIPSIS,
    isDataReady: undefined,
    isWebsocket: false
  };
};

export const blocksSlice = createSlice({
  name: 'blocksSlice',
  initialState: getInitialBlocksState(),
  reducers: {
    setBlocks: (
      state: BlocksSliceType,
      action: PayloadAction<BlocksSliceType>
    ) => {
      const existingHashes = state.blocks.map((block: BlockType) => block.hash);
      const newBlocks = action.payload.blocks.map((block: BlockType) => ({
        ...block,
        isNew: !existingHashes.includes(block.hash)
      }));

      state.blocks = newBlocks;
      state.blocksCount = action.payload.blocksCount;
      state.isDataReady = action.payload.isDataReady;
      state.isWebsocket = action.payload.isWebsocket;
    }
  }
});

export const { setBlocks } = blocksSlice.actions;

export const blocksReducer = blocksSlice.reducer;
