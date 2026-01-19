import { createSelector } from 'reselect';
import { RootState } from '../../store';

const stateSelector = (state: RootState) => {
  return state.customTransactions;
};

export const customTransactionsSelector = createSelector(
  stateSelector,
  (state) => state
);
