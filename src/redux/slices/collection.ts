import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NftEnumType } from 'types';
import { CollectionSliceType } from 'types/collection.types';

export const getInitialCollectionState = (): CollectionSliceType => {
  return {
    collectionState: {
      collection: '',
      type: NftEnumType.NonFungibleESDT,
      name: '',
      ticker: '',
      timestamp: 0,
      canFreeze: false,
      canWipe: false,
      canPause: false,
      canTransferNftCreateRole: false,
      canChangeOwner: false,
      canUpgrade: false,
      canAddSpecialRoles: false,
      canTransfer: false,
      owner: ''
    },
    isFetched: false
  };
};

export const collectionSlice = createSlice({
  name: 'collectionSlice',
  initialState: getInitialCollectionState(),
  reducers: {
    setCollection: (
      state: CollectionSliceType,
      action: PayloadAction<CollectionSliceType>
    ) => {
      state.collectionState = { ...state.collectionState, ...action.payload };
    }
  }
});

export const { setCollection } = collectionSlice.actions;

export const collectionReducer = collectionSlice.reducer;
