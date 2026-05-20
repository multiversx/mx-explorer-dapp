import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

const stateSelector = (state: RootState) => {
  return state.stats;
};

export const statsSelector = createSelector(stateSelector, (state) => state);
