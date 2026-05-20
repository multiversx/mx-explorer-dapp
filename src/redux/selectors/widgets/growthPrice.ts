import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';

const stateSelector = (state: RootState) => {
  return state.growthPrice;
};

export const growthPriceSelector = createSelector(
  stateSelector,
  (state) => state
);
