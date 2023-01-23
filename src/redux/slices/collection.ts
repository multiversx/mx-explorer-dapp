import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NftEnumType } from 'types';
import { CollectionSliceType } from 'types/collection.types';

export const getInitialCollectionState = (): CollectionSliceType => {
  return {
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
    owner: '',

    collectionFetched: false,
  };
};

export const collectionSlice = createSlice({
  name: 'collectionSlice',
  initialState: getInitialCollectionState(),
  reducers: {
    setCollection: (state: CollectionSliceType, action: PayloadAction<CollectionSliceType>) => {
      state.collection = action.payload.collection;
      state.type = action.payload.type;
      state.name = action.payload.name;
      state.ticker = action.payload.ticker;
      state.timestamp = action.payload.timestamp;
      state.canFreeze = action.payload.canFreeze;
      state.canWipe = action.payload.canWipe;
      state.canPause = action.payload.canPause;
      state.canTransferNftCreateRole = action.payload.canTransferNftCreateRole;
      state.canChangeOwner = action.payload.canChangeOwner;
      state.canUpgrade = action.payload.canUpgrade;
      state.canAddSpecialRoles = action.payload.canAddSpecialRoles;
      state.canTransfer = action.payload.canTransfer;
      state.owner = action.payload.owner;

      state.collectionFetched = action.payload.collectionFetched;
    },
  },
});

export const { setCollection } = collectionSlice.actions;

export const collectionReducer = collectionSlice.reducer;
