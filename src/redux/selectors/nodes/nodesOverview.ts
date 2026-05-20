import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';

const stateSelector = (state: RootState) => {
  return state.nodesOverview;
};

export const nodesOverviewSelector = createSelector(
  stateSelector,
  (state) => state
);
