import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SliceType } from 'types';
import { SearchResponseType } from 'types/search.types';

export interface SearchSliceType extends SliceType {
  searchQuery: string;
  search: SearchResponseType;
}

export const searchSlice = createSlice({
  name: 'searchSlice',
  initialState: {
    search: {} as SearchResponseType,
    searchQuery: '',
    isDataReady: undefined
  },
  reducers: {
    setSearch: (
      state: SearchSliceType,
      action: PayloadAction<SearchSliceType>
    ) => {
      state.search = action.payload.search;
      state.searchQuery = action.payload.searchQuery;
      state.isDataReady = action.payload.isDataReady;
    }
  }
});

export const { setSearch } = searchSlice.actions;

export const searchReducer = searchSlice.reducer;
