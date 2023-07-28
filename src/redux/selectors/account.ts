import { createSelector } from 'reselect';
import { RootState } from '../store';

const stateSelector = (state: RootState) => {
  return state.account;
};

export const accountSelector = createSelector(stateSelector, (state) => state);
