import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

const stateSelector = (state: RootState) => {
  return state.collection;
};

export const collectionSelector = createSelector(
  stateSelector,
  (state) => state
);
