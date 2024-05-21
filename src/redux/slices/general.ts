import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { METACHAIN_SHARD_ID } from 'appConstants';

import { sortShards } from 'helpers/sortShards';
import { ShardType } from 'types';

export type GeneralSliceType = {
  shards: ShardType[];
};

export function getInitialGeneralState(): GeneralSliceType {
  return {
    shards: []
  };
}

export const generalSlice = createSlice({
  name: 'generalSlice',
  initialState: getInitialGeneralState(),
  reducers: {
    setShards: (
      state: GeneralSliceType,
      action: PayloadAction<GeneralSliceType['shards']>
    ) => {
      state.shards = sortShards({ shards: action.payload, METACHAIN_SHARD_ID });
    }
  }
});

export const { setShards } = generalSlice.actions;

export const generalReducer = generalSlice.reducer;
