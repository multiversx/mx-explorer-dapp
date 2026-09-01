import { RootState } from '../store';

const stateSelector = (state: RootState) => {
  return state.token;
};

export const tokenSelector = stateSelector;
