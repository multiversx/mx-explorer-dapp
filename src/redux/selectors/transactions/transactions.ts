import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';

const stateSelector = (state: RootState) => {
  return state.transactions;
};

export const transactionsSelector = createSelector(
  stateSelector,
  (state) => state
);
