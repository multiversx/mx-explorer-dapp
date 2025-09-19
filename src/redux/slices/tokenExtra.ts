import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ExchangePriceRangeEnum } from 'types';
import { TokenExtraSliceType } from 'types/token.types';

export const getInitialTokenExtraState = (): TokenExtraSliceType => {
  return {
    tokenExtra: {
      range: ExchangePriceRangeEnum.hourly,
      identifier: '',
      priceHistory: []
    },
    isDataReady: false
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
      state.tokenExtra.range = action.payload.tokenExtra.range;
      state.tokenExtra.priceHistory = action.payload.tokenExtra.priceHistory;

      state.isDataReady = action.payload.isDataReady;
    }
  }
});

export const { setTokenExtra } = tokenExtraSlice.actions;

export const tokenExtraReducer = tokenExtraSlice.reducer;
