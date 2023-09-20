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
    isFetched: false
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
      state.token = {
        ...getInitialTokenState().token,
        ...action.payload
      };
    }
  }
});

export const { setToken } = tokenSlice.actions;

export const tokenReducer = tokenSlice.reducer;
