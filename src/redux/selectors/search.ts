import { createSelector } from 'reselect';
import { RootState } from '../store';

const stateSelector = (state: RootState) => {
  return state.search;
};

export const searchSelector = createSelector(stateSelector, (state) => state);
