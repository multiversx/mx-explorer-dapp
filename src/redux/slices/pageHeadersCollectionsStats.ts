import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  HeadersBlocksType,
  HeadersCollectionsType,
  PageHeaderStatsType
} from '../../types/headerStats.types';

export const getInitialHeaderCollectionsStatsState =
  (): HeadersCollectionsType => {
    return {};
  };

export const pageHeadersCollectionsStatsSlice = createSlice({
  name: 'pageHeadersCollectionsStatsSlice',
  initialState: getInitialHeaderCollectionsStatsState(),
  reducers: {
    setPageHeaderCollectionsStats: (
      state: HeadersCollectionsType,
      action: PayloadAction<HeadersCollectionsType>
    ) => {
      state.totalCollections = action.payload.totalCollections;
      state.totalHolders = action.payload.totalHolders;
      state.totalNFTsCreated = action.payload.totalNFTsCreated;
      state.newNFTsInLast30d = action.payload.newNFTsInLast30d;
    }
  }
});

export const { setPageHeaderCollectionsStats } =
  pageHeadersCollectionsStatsSlice.actions;

export const pageHeadersCollectionsReducer =
  pageHeadersCollectionsStatsSlice.reducer;
