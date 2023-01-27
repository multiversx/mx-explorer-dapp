import { createSelector } from 'reselect';
import { RootState } from '../store';

const stateSelector = (state: RootState) => {
  return state.growthTransactions;
};

export const growthTransactionsSelector = createSelector(
  stateSelector,
  (state) => state
);
