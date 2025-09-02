import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SearchResultType, SearchSliceType } from 'types';

export const getInitialSearchState = (): SearchSliceType => {
  return {
    latestSearches: [],
    topTokens: [],
    topCollections: [],
    topApps: []
  };
};

export const searchSlice = createSlice({
  name: 'searchSlice',
  initialState: getInitialSearchState(),
  reducers: {
    addLatestSearch: (
      state: SearchSliceType,
      action: PayloadAction<SearchResultType>
    ) => {
      const searchResult = action.payload;
      const resultAlreadyExists = state.latestSearches.some(
        (t) => t.id === searchResult.id
      );
      if (!resultAlreadyExists) {
        state.latestSearches.push(searchResult);
      }
    },
    setTopTokens: (
      state: SearchSliceType,
      action: PayloadAction<SearchSliceType>
    ) => {
      state.topTokens = action.payload.topTokens;
    },
    setTopCollections: (
      state: SearchSliceType,
      action: PayloadAction<SearchSliceType>
    ) => {
      state.topCollections = action.payload.topCollections;
    },
    setTopApps: (
      state: SearchSliceType,
      action: PayloadAction<SearchSliceType>
    ) => {
      state.topApps = action.payload.topApps;
    }
  }
});

export const { addLatestSearch, setTopTokens, setTopCollections, setTopApps } =
  searchSlice.actions;

export const searchReducer = searchSlice.reducer;
