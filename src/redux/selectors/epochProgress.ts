import { createSelector } from 'reselect';
import { RootState } from '../store';

const stateSelector = (state: RootState) => state.epochProgress;

export const epochRoundsLeftSelector = createSelector(
  stateSelector,
  (state) => state.roundsLeft
);
