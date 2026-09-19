import { RootState } from '../../store';

const stateSelector = (state: RootState) => {
  return state.growthEconomics;
};

export const growthEconomicsSelector = stateSelector;
