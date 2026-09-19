import { RootState } from '../../store';

const stateSelector = (state: RootState) => {
  return state.growthHero;
};

export const growthHeroSelector = stateSelector;
