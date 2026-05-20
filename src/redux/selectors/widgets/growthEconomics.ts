import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';

const stateSelector = (state: RootState) => {
  return state.growthEconomics;
};

export const growthEconomicsSelector = createSelector(
  stateSelector,
  (state) => state
);
