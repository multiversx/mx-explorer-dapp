import BigNumber from 'bignumber.js';
import moment from 'moment';
import { DIGITS } from 'config';
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

export const processStats = (data: StatsType) => {
  const { check, epochPercentage } = getExtraStats(data);

  return {
    shards: new BigNumber(data.shards).toFormat(),
    blocks: new BigNumber(data.blocks).toFormat(),
    accounts: new BigNumber(data.accounts).toFormat(),
    transactions: new BigNumber(data.transactions).toFormat(),
    refreshRate: data.refreshRate,
    epoch: new BigNumber(data.epoch).toFormat(),
    epochPercentage: `${new BigNumber(epochPercentage).toFormat(DIGITS)}%`,
    epochTotalTime: check
      ? moment.utc(data.refreshRate * data.roundsPerEpoch).format('HH:mm')
      : '...',
    epochTimeElapsed: check
      ? moment.utc(data.refreshRate * data.roundsPassed).format('HH:mm')
      : '...',
    epochTimeRemaining: check
      ? moment
          .utc(data.refreshRate * (data.roundsPerEpoch - data.roundsPassed))
          .format('HH:mm')
      : '...',
    roundsPerEpoch: new BigNumber(data.roundsPerEpoch).toFormat(),
    roundsPassed: new BigNumber(data.roundsPassed).toFormat()
  };
};