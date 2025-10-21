import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ELLIPSIS } from 'appConstants';
import { EconomicsSliceType } from 'types/economics.types';

export const getInitialEconomicsState = (): EconomicsSliceType => {
  return {
    totalSupply: ELLIPSIS,
    circulatingSupply: ELLIPSIS,
    staked: ELLIPSIS,
    price: ELLIPSIS,
    marketCap: ELLIPSIS,
    apr: ELLIPSIS,
    topUpApr: ELLIPSIS,
    baseApr: ELLIPSIS,
    tokenMarketCap: ELLIPSIS,

    totalStakedPercent: ELLIPSIS,
    ecosystemMarketCap: ELLIPSIS,

    unprocessed: {
      totalSupply: 0,
      circulatingSupply: 0,
      staked: 0,
      price: 0,
      marketCap: 0,
      apr: 0,
      topUpApr: 0,
      baseApr: 0,
      tokenMarketCap: 0
    },
    isDataReady: undefined
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

      state.totalStakedPercent = action.payload.totalStakedPercent;
      state.ecosystemMarketCap = action.payload.ecosystemMarketCap;

      state.unprocessed = action.payload.unprocessed;
      state.isDataReady = action.payload.isDataReady;
    }
  }
});

export const { setEconomics } = economicsSlice.actions;

export const economicsReducer = economicsSlice.reducer;
