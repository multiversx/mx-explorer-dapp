import { createSelector } from 'reselect';
import { RootState } from '../store';

const stateSelector = (state: RootState) => {
  return state.growthSearch;
};

export const growthSearchSelector = createSelector(
  stateSelector,
  (state) => state
);
