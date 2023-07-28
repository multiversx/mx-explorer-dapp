import { createSelector } from 'reselect';
import { RootState } from '../store';

const stateSelector = (state: RootState) => {
  return state.pageHeadersTokensStats;
};

export const pageHeaderTokensStatsSelector = createSelector(
  stateSelector,
  (state) => state
);
