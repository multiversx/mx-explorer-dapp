import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';

const stateSelector = (state: RootState) => {
  return state.transactionsInPool;
};

export const transactionsInPoolSelector = createSelector(
  stateSelector,
  (state) => state
);
