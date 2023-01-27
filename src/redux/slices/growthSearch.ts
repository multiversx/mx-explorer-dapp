import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ELLIPSIS } from 'appConstants';
import { GrowthSearchSliceType, TrendEnum } from 'types';

export const getInitialGrowthSearchState = (): GrowthSearchSliceType => {
  return {
    currentPrice: ELLIPSIS,
    priceChange24h: ELLIPSIS,
    activeAccountsToday: ELLIPSIS,
    priceChangeTrend: TrendEnum.neutral,

    unprocessed: {
      currentPrice: 0,
      priceChange24h: 0,
      activeAccountsToday: 0
    },
    isFetched: false
  };
};

export const growthSearchSlice = createSlice({
  name: 'growthSearchSlice',
  initialState: getInitialGrowthSearchState(),
  reducers: {
    setGrowthSearch: (
      state: GrowthSearchSliceType,
      action: PayloadAction<GrowthSearchSliceType>
    ) => {
      state.currentPrice = action.payload.currentPrice;
      state.priceChange24h = action.payload.priceChange24h;
      state.activeAccountsToday = action.payload.activeAccountsToday;
      state.priceChangeTrend = action.payload.priceChangeTrend;

      state.unprocessed = action.payload.unprocessed;
      state.isFetched = action.payload.isFetched;
    }
  }
});

export const { setGrowthSearch } = growthSearchSlice.actions;

export const growthSearchReducer = growthSearchSlice.reducer;
