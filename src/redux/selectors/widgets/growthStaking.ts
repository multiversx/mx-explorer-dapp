import { RootState } from '../../store';

const stateSelector = (state: RootState) => {
  return state.growthStaking;
};

export const growthStakingSelector = stateSelector;
