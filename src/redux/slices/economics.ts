import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EconomicsSliceType } from 'types/economics.types';

export const getInitialEconomicsState = (): EconomicsSliceType => {
  return {
    totalSupply: 0,
    circulatingSupply: 0,
    staked: 0,
    price: 0,
    marketCap: 0,
    apr: 0,
    topUpApr: 0,
    baseApr: 0,
    tokenMarketCap: 0,

    economicsFetched: false,
    totalStakedPercent: 0,
    ecosystemMarketCap: 0
  };
};

export const economicsSlice = createSlice({
  name: 'economicsSlice',
  initialState: getInitialEconomicsState(),
  reducers: {
    setEconomics: (
      state: EconomicsSliceType,
      action: PayloadAction<EconomicsSliceType>
    ) => {
      state.totalSupply = action.payload.totalSupply;
      state.circulatingSupply = action.payload.circulatingSupply;
      state.staked = action.payload.staked;
      state.price = action.payload.price;
      state.marketCap = action.payload.marketCap;
      state.apr = action.payload.apr;
      state.topUpApr = action.payload.topUpApr;
      state.baseApr = action.payload.baseApr;
      state.tokenMarketCap = action.payload.tokenMarketCap;

      state.economicsFetched = action.payload.economicsFetched;
      state.totalStakedPercent = action.payload.totalStakedPercent;
      state.ecosystemMarketCap = action.payload.ecosystemMarketCap;
    }
  }
});

export const { setEconomics } = economicsSlice.actions;

export const economicsReducer = economicsSlice.reducer;
