import { RootState } from '../../store';

const stateSelector = (state: RootState) => {
  return state.growthPrice;
};

export const growthPriceSelector = stateSelector;
