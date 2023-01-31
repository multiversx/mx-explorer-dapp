import { createSelector } from 'reselect';
import { RootState } from '../store';

const stateSelector = (state: RootState) => {
  return state.pageHeadersAccountsStats;
};

export const pageHeadersAccountsStatsSelector = createSelector(
  stateSelector,
  (state) => state
);
