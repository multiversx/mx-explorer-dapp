import { RootState } from '../store';

const stateSelector = (state: RootState) => {
  return state.stake;
};

export const stakeSelector = stateSelector;
