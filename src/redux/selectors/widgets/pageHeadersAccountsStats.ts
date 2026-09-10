import { RootState } from '../../store';

const stateSelector = (state: RootState) => {
  return state.pageHeadersAccountsStats;
};

export const pageHeadersAccountsStatsSelector = stateSelector;
