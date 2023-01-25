import { createSelector } from 'reselect';
import { RootState } from '../store';

const stateSelector = (state: RootState) => {
  return state.refresh;
};

export const refreshSelector = createSelector(
  stateSelector,
  (state) => state.refresh
);
