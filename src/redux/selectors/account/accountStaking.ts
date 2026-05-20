import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';

const stateSelector = (state: RootState) => {
  return state.accountStaking;
};

export const accountStakingSelector = createSelector(
  stateSelector,
  (state) => state
);
