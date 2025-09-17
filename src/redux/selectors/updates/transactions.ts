import { createSelector } from 'reselect';
import { RootState } from '../../store';

const stateSelector = (state: RootState) => {
  return state.transactions;
};

export const transactionsSelector = createSelector(
  stateSelector,
  (state) => state
);
