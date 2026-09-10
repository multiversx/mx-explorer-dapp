import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

const stateSelector = (state: RootState) => {
  return state.economics;
};

export const economicsSelector = stateSelector;

export const usdPriceSelector = createSelector(
  stateSelector,
  (state) => state.price
);
