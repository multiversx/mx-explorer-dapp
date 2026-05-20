import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';

const stateSelector = (state: RootState) => {
  return state.growthTransactions;
};

export const growthTransactionsSelector = createSelector(
  stateSelector,
  (state) => state
);
