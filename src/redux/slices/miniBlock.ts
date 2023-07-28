import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MiniBlockType } from 'types/miniBlock.types';

export const getInitialMiniBlockState = (): MiniBlockType => {
  return {
    senderShard: 0,
    receiverShard: 0,
    senderBlockHash: '',
    receiverBlockHash: '',
    type: '',
    miniBlockHash: ''
  };
};

export const miniBlockSlice = createSlice({
  name: 'miniBlockSlice',
  initialState: getInitialMiniBlockState(),
  reducers: {
    setMiniBlock: (
      state: MiniBlockType,
      action: PayloadAction<MiniBlockType>
    ) => {
      state.senderShard = action.payload.senderShard;
      state.receiverShard = action.payload.receiverShard;
      state.senderBlockHash = action.payload.senderBlockHash;
      state.receiverBlockHash = action.payload.receiverBlockHash;
      state.type = action.payload.type;
      state.miniBlockHash = action.payload.miniBlockHash;
    }
  }
});

export const { setMiniBlock } = miniBlockSlice.actions;

export const miniBlockReducer = miniBlockSlice.reducer;
