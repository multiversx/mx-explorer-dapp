import { RootState } from '../../store';

const stateSelector = (state: RootState) => {
  return state.accountStaking;
};

export const accountStakingSelector = stateSelector;
