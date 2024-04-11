import { createSelector } from 'reselect';
import { RootState } from '../store';

const stateSelector = (state: RootState) => {
  return state.general;
};

export const generalSelector = createSelector(stateSelector, (state) => state);

export const shardsSelector = createSelector(
  stateSelector,
  (state) => state.shards
);
