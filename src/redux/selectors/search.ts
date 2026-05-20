import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

const stateSelector = (state: RootState) => {
  return state.search;
};

export const searchSelector = createSelector(stateSelector, (state) => state);
