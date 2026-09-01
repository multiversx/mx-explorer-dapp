import { RootState } from '../../store';

const stateSelector = (state: RootState) => {
  return state.customTransactions;
};

export const customTransactionsSelector = stateSelector;
