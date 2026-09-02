import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ELLIPSIS } from 'appConstants';
import { BlocksSliceType, BlockType } from 'types';

export const getInitialBlocksState = (): BlocksSliceType => {
  return {
    blocks: [],
    blocksCount: ELLIPSIS,
    isDataReady: undefined,
    isRefreshPaused: false,
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
      const previousByHash = new Map(
        state.blocks.map((block: BlockType) => [block.hash, block])
      );
      const newBlocks = action.payload.blocks.map((block: BlockType) => {
        const previous = previousByHash.get(block.hash);
        const next = { ...block, isNew: !previous };

        return previous && JSON.stringify(previous) === JSON.stringify(next)
          ? previous
          : next;
      });

      const isUnchanged =
        newBlocks.length === state.blocks.length &&
        newBlocks.every((block, index) => block === state.blocks[index]);

      if (!isUnchanged) {
        state.blocks = newBlocks;
      }

      if (action.payload.blocksCount !== ELLIPSIS) {
        state.blocksCount = action.payload.blocksCount;
      }

      state.isDataReady = action.payload.isDataReady;
      state.isWebsocket = action.payload.isWebsocket;
    },
    pauseBlocksRefresh: (state: BlocksSliceType) => {
      state.isRefreshPaused = true;
    },
    resumeBlocksRefresh: (state: BlocksSliceType) => {
      state.isRefreshPaused = false;
    }
  }
});

export const { setBlocks, pauseBlocksRefresh, resumeBlocksRefresh } =
  blocksSlice.actions;

export const blocksReducer = blocksSlice.reducer;
