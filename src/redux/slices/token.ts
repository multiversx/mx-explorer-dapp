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
      // state.identifier = action.payload.identifier;
      // state.ticker = action.payload.ticker;
      // state.name = action.payload.name;
      // state.owner = action.payload.owner;
      // state.minted = action.payload.minted;
      // state.burnt = action.payload.burnt;
      // state.supply = action.payload.supply;
      // state.circulatingSupply = action.payload.circulatingSupply;
      // state.canBurn = action.payload.canBurn;
      // state.canChangeOwner = action.payload.canChangeOwner;
      // state.canFreeze = action.payload.canFreeze;
      // state.canMint = action.payload.canMint;
      // state.canPause = action.payload.canPause;
      // state.canUpgrade = action.payload.canUpgrade;
      // state.canWipe = action.payload.canWipe;
      // state.isPaused = action.payload.isPaused;
      // state.accounts = action.payload.accounts;
      // state.transactions = action.payload.transactions;

      state.token = { ...state.token, ...action.payload };
    }
  }
});

export const { setToken } = tokenSlice.actions;

export const tokenReducer = tokenSlice.reducer;
