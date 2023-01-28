import { createSelector } from 'reselect';
import { RootState } from '../store';

const stateSelector = (state: RootState) => {
  return state.miniBlock;
};

export const miniBlockSelector = createSelector(
  stateSelector,
  (state) => state
);
