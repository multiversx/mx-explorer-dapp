import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NftEnumType } from 'types';
import { CollectionType } from 'types/collection.types';

export const getInitialCollectionState = (): CollectionType => {
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
    owner: ''
  };
};

export const collectionSlice = createSlice({
  name: 'collectionSlice',
  initialState: getInitialCollectionState(),
  reducers: {
    setCollection: (
      state: CollectionType,
      action: PayloadAction<CollectionType>
    ) => {
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
    }
  }
});

export const { setCollection } = collectionSlice.actions;

export const collectionReducer = collectionSlice.reducer;
