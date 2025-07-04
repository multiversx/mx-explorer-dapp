import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TokenExtraSliceType } from 'types/token.types';

export const getInitialTokenExtraState = (): TokenExtraSliceType => {
  return {
    tokenExtra: {
      identifier: '',
      priceHistory: []
    },
    isFetched: false
  };
};

export const tokenExtraSlice = createSlice({
  name: 'tokenExtraSlice',
  initialState: getInitialTokenExtraState(),
  reducers: {
    setTokenExtra: (
      state: TokenExtraSliceType,
      action: PayloadAction<TokenExtraSliceType>
    ) => {
      state.tokenExtra.identifier = action.payload.tokenExtra.identifier;
      state.tokenExtra.priceHistory = action.payload.tokenExtra.priceHistory;

      state.isFetched = action.payload.isFetched;
    }
  }
});

export const { setTokenExtra } = tokenExtraSlice.actions;

export const tokenExtraReducer = tokenExtraSlice.reducer;
