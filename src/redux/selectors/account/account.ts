import { RootState } from '../../store';

const stateSelector = (state: RootState) => {
  return state.account;
};

export const accountSelector = stateSelector;
