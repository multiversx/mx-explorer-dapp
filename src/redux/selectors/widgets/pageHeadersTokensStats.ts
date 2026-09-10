import { RootState } from '../../store';

const stateSelector = (state: RootState) => {
  return state.pageHeadersTokensStats;
};

export const pageHeaderTokensStatsSelector = stateSelector;
