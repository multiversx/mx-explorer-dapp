import BigNumber from 'bignumber.js';

import { ELLIPSIS } from 'appConstants';
import { formatClockDuration } from 'helpers/formatValue/formatClockDuration';
import { StatsType } from 'types/stats.types';

export const getExtraStats = (data: StatsType) => {
  const check = data.roundsPerEpoch >= data.roundsPassed;

  const epochPercentage = check
    ? (100 * data.roundsPassed) / data.roundsPerEpoch
    : 0;
  const epochTotalTime = check ? data.refreshRate * data.roundsPerEpoch : 0;
  const epochTimeElapsed = check ? data.refreshRate * data.roundsPassed : 0;
  const epochTimeRemaining = check
    ? data.refreshRate * (data.roundsPerEpoch - data.roundsPassed)
    : 0;

  return {
    check,
    epochPercentage,
    epochTotalTime,
    epochTimeElapsed,
    epochTimeRemaining
  };
};

export type ExtraStatsType = ReturnType<typeof getExtraStats>;

export const processStats = (data: StatsType, extraStats?: ExtraStatsType) => {
  const {
    check,
    epochPercentage,
    epochTotalTime,
    epochTimeElapsed,
    epochTimeRemaining
  } = extraStats ?? getExtraStats(data);

  return {
    shards: new BigNumber(data.shards).toFormat(),
    blocks: new BigNumber(data.blocks).toFormat(),
    accounts: new BigNumber(data.accounts).toFormat(),
    transactions: new BigNumber(data.transactions).toFormat(),
    scResults: new BigNumber(data.scResults).toFormat(),
    refreshRate: data.refreshRate,
    epoch: data.epoch,
    epochPercentage,
    epochTotalTime: check ? formatClockDuration(epochTotalTime) : ELLIPSIS,
    epochTimeElapsed: check ? formatClockDuration(epochTimeElapsed) : ELLIPSIS,
    epochTimeRemaining: check
      ? formatClockDuration(epochTimeRemaining)
      : ELLIPSIS,
    roundsPerEpoch: data.roundsPerEpoch,
    roundsPassed: data.roundsPassed
  };
};
