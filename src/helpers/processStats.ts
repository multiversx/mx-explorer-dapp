import moment from 'moment';
import BigNumber from 'bignumber.js';

export const initialStats = {
  shards: '...',
  blocks: '...',
  accounts: '...',
  transactions: '...',
  epoch: 0,
  epochPercentage: 0,
  epochTotalTime: '...',
  epochTimeElapsed: '...',
  epochTimeRemaining: '...',
  roundsPerEpoch: 0,
  roundsPassed: 0,
};

export default function processStats(statsData: any) {
  const { data, success } = statsData;
  const check = success ? data.roundsPerEpoch >= data.roundsPassed : false;

  const newStats = success
    ? {
        shards: new BigNumber(data.shards).toFormat(),
        blocks: new BigNumber(data.blocks).toFormat(),
        accounts: new BigNumber(data.accounts).toFormat(),
        transactions: new BigNumber(data.transactions).toFormat(),
        epoch: data.epoch,
        epochPercentage: check ? (100 * data.roundsPassed) / data.roundsPerEpoch : 0,
        epochTotalTime: check
          ? moment.utc(data.refreshRate * data.roundsPerEpoch).format('HH:mm')
          : '...',
        epochTimeElapsed: check
          ? moment.utc(data.refreshRate * data.roundsPassed).format('HH:mm')
          : '...',
        epochTimeRemaining: check
          ? moment.utc(data.refreshRate * (data.roundsPerEpoch - data.roundsPassed)).format('HH:mm')
          : '...',
        roundsPerEpoch: data.roundsPerEpoch,
        roundsPassed: data.roundsPassed,
      }
    : initialStats;

  return newStats;
}
