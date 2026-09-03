import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

const stateSelector = (state: RootState) => {
  return state.blocks;
};

export const blocksSelector = createSelector(stateSelector, (state) => state);
