import { createSelector } from 'reselect';
import { RootState } from '../store';

const stateSelector = (state: RootState) => {
  return state.growthMostUsed;
};

export const growthMostUsedSelector = createSelector(
  stateSelector,
  (state) => state
);
