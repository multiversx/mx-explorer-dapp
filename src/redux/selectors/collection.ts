import { createSelector } from 'reselect';
import { RootState } from '../store';

const stateSelector = (state: RootState) => {
  return state.collection;
};

export const collectionSelector = createSelector(
  stateSelector,
  (state) => state
);
