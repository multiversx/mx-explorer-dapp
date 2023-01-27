import { createSelector } from 'reselect';
import { RootState } from '../store';

const stateSelector = (state: RootState) => {
  return state.growthStaking;
};

export const growthStakingSelector = createSelector(
  stateSelector,
  (state) => state
);
