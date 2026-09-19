import { RootState } from '../../store';

const stateSelector = (state: RootState) => {
  return state.growthSearch;
};

export const growthSearchSelector = stateSelector;
