import { RootState } from '../../store';

const stateSelector = (state: RootState) => {
  return state.growthMostUsed;
};

export const growthMostUsedSelector = stateSelector;
