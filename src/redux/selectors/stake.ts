import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

const stateSelector = (state: RootState) => {
  return state.stake;
};

export const stakeSelector = createSelector(stateSelector, (state) => state);
