import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

const stateSelector = (state: RootState) => {
  return state.miniBlock;
};

export const miniBlockSelector = createSelector(
  stateSelector,
  (state) => state
);
