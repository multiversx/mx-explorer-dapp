import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NftTypeEnum } from 'types';
import { NftSliceType } from 'types/nft.types';

export const getInitialNftState = (): NftSliceType => {
  return {
    nftState: {
      identifier: '',
      collection: '',
      timestamp: 0,
      attributes: '',
      nonce: 0,
      type: NftTypeEnum.NonFungibleESDT,
      name: '',
      creator: '',
      royalties: 0,
      balance: ''
    },
    isDataReady: false
  };
};

export const nftSlice = createSlice({
  name: 'nftSlice',
  initialState: getInitialNftState(),
  reducers: {
    setNft: (state: NftSliceType, action: PayloadAction<NftSliceType>) => {
      state.isDataReady = action.payload.isDataReady;
      state.nftState = {
        ...getInitialNftState().nftState,
        ...action.payload.nftState
      };
    }
  }
});

export const { setNft } = nftSlice.actions;

export const nftReducer = nftSlice.reducer;
