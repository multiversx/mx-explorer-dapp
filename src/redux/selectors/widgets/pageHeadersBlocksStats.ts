import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';

const stateSelector = (state: RootState) => {
  return state.pageHeadersBlocksStats;
};

export const pageHeadersBlocksStatsSelector = createSelector(
  stateSelector,
  (state) => state
);
