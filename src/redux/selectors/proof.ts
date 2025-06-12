import { createSelector } from 'reselect';
import { RootState } from '../store';

const stateSelector = (state: RootState) => {
  return state.proof;
};

export const proofSelector = createSelector(stateSelector, (state) => state);
