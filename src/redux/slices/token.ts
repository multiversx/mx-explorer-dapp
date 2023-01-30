import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TokenSliceType } from 'types/token.types';

export const getInitialTokenState = (): TokenSliceType => {
  return {
    token: {
      identifier: '',
      ticker: '',
      name: '',
      owner: '',
      minted: '',
      burnt: '',
      supply: '',
      circulatingSupply: '',
      canBurn: false,
      canChangeOwner: false,
      canFreeze: false,
      canMint: false,
      canPause: false,
      canUpgrade: false,
      canWipe: false,
      isPaused: false,
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
