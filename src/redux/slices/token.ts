import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TokenSliceType, TokenTypeEnum } from 'types/token.types';

export const getInitialTokenState = (): TokenSliceType => {
  return {
    token: {
      type: TokenTypeEnum.FungibleESDT,
      identifier: '',
      ticker: '',
      name: '',
      owner: '',
      minted: '',
      burnt: '',
      supply: '',
      circulatingSupply: '',
      accounts: 0,
      transactions: 0
    },
    isDataReady: false
  };
};

export const tokenSlice = createSlice({
  name: 'tokenSlice',
  initialState: getInitialTokenState(),
  reducers: {
    setToken: (
      state: TokenSliceType,
      action: PayloadAction<TokenSliceType>
    ) => {
      state.isDataReady = action.payload.isDataReady;
      state.token = {
        ...getInitialTokenState().token,
        ...action.payload.token
      };
    }
  }
});

export const { setToken } = tokenSlice.actions;

export const tokenReducer = tokenSlice.reducer;
