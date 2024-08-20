import { createSelector } from 'reselect';
import { RootState } from '../store';

const stateSelector = (state: RootState) => {
  return state.stakeExtra;
};

export const stakeExtraSelector = createSelector(
  stateSelector,
  (state) => state
);
