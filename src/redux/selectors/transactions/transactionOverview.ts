import { createSelector } from 'reselect';
import { RootState } from '../../store';

const stateSelector = (state: RootState) => {
  return state.transactionOverview;
};

export const transactionOverviewSelector = createSelector(
  stateSelector,
  (state) => state
);
