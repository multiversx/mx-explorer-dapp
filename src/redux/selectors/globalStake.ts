import { createSelector } from 'reselect';
import { RootState } from '../store';

const stateSelector = (state: RootState) => {
  return state.globalStake;
};

export const globalStakeSelector = createSelector(stateSelector, (state) => state);
