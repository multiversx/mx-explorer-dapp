import { createSelector } from 'reselect';
import { RootState } from '../store';

const stateSelector = (state: RootState) => {
  return state.blocks;
};

export const blocksSelector = createSelector(stateSelector, (state) => state);
