import { createSelector } from 'reselect';
import { RootState } from '../store';

const stateSelector = (state: RootState) => {
  return state.nodesVersions;
};

export const nodesVersionsSelector = createSelector(
  stateSelector,
  (state) => state
);
