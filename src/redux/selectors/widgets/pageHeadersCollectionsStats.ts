import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';

const stateSelector = (state: RootState) => {
  return state.pageHeadersCollectionsStats;
};

export const pageHeadersCollectionsStatsSelector = createSelector(
  stateSelector,
  (state) => state
);
