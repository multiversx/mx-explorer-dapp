import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

const stateSelector = (state: RootState) => {
  return state.general;
};

export const generalSelector = stateSelector;

export const shardsSelector = createSelector(
  stateSelector,
  (state) => state.shards
);
