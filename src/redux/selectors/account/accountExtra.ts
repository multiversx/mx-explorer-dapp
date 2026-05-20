import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';

const stateSelector = (state: RootState) => {
  return state.accountExtra;
};

export const accountExtraSelector = createSelector(
  stateSelector,
  (state) => state
);
