import { StatsType } from 'types/stats.types';

export const processStats = (data: StatsType) => {
  const check = data.roundsPerEpoch >= data.roundsPassed;

  return {
    ...data,
    statsFetched: true,
    epochPercentage: check
      ? (100 * data.roundsPassed) / data.roundsPerEpoch
      : 0,
    epochTotalTime: check ? data.refreshRate * data.roundsPerEpoch : 0,
    epochTimeElapsed: check ? data.refreshRate * data.roundsPassed : 0,
    epochTimeRemaining: check
      ? data.refreshRate * (data.roundsPerEpoch - data.roundsPassed)
      : 0
  };
};
