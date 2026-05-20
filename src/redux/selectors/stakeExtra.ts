import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

const stateSelector = (state: RootState) => {
  return state.stakeExtra;
};

export const stakeExtraSelector = createSelector(
  stateSelector,
  (state) => state
);
