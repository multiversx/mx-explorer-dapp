import { createSelector } from 'reselect';
import { RootState } from '../store';

const stateSelector = (state: RootState) => {
  return state.nodesIdentities;
};

export const nodesIdentitiesSelector = createSelector(
  stateSelector,
  (state) => state
);
