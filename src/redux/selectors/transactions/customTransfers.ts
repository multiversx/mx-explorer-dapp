import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';

const stateSelector = (state: RootState) => {
  return state.customTransfers;
};

export const customTransfersSelector = createSelector(
  stateSelector,
  (state) => state
);
