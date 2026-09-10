import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

const stateSelector = (state: RootState) => state.epochProgress;

export const epochRoundsLeftSelector = createSelector(
  stateSelector,
  (state) => state.roundsLeft
);
