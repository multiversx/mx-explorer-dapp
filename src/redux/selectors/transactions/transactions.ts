import { RootState } from '../../store';

const stateSelector = (state: RootState) => {
  return state.transactions;
};

export const transactionsSelector = stateSelector;
