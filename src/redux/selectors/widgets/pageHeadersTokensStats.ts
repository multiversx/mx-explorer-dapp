import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';

const stateSelector = (state: RootState) => {
  return state.pageHeadersTokensStats;
};

export const pageHeaderTokensStatsSelector = createSelector(
  stateSelector,
  (state) => state
);
