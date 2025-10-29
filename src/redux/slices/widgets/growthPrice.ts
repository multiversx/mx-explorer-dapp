import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ELLIPSIS } from 'appConstants';
import { GrowthPriceSliceType, TrendEnum } from 'types';

export const getInitialGrowthPriceState = (): GrowthPriceSliceType => {
  return {
    currentPrice: ELLIPSIS,
    priceChange24h: ELLIPSIS,
    marketCap: ELLIPSIS,
    volume24h: ELLIPSIS,
    priceChangeTrend: TrendEnum.neutral,

    price7d: [],
    price30d: [],
    priceAll: [],

    unprocessed: {
      currentPrice: 0,
      priceChange24h: 0,
      marketCap: 0,
      volume24h: 0
    },
    isDataReady: false
  };
};

export const growthPriceSlice = createSlice({
  name: 'growthPriceSlice',
  initialState: getInitialGrowthPriceState(),
  reducers: {
    setGrowthPrice: (
      state: GrowthPriceSliceType,
      action: PayloadAction<GrowthPriceSliceType>
    ) => {
      state.currentPrice = action.payload.currentPrice;
      state.priceChange24h = action.payload.priceChange24h;
      state.marketCap = action.payload.marketCap;
      state.volume24h = action.payload.volume24h;
      state.priceChangeTrend = action.payload.priceChangeTrend;

      state.price7d = action.payload.price7d;
      state.price30d = action.payload.price30d;
      state.priceAll = action.payload.priceAll;

      state.unprocessed = action.payload.unprocessed;
      state.isDataReady = action.payload.isDataReady;
    }
  }
});

export const { setGrowthPrice } = growthPriceSlice.actions;

export const growthPriceReducer = growthPriceSlice.reducer;
