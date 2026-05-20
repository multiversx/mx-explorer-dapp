import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';

const stateSelector = (state: RootState) => {
  return state.growthHero;
};

export const growthHeroSelector = createSelector(
  stateSelector,
  (state) => state
);
