import moment from 'moment';

export const initialStats = {
  shards: '...',
  blocks: '...',
  accounts: '...',
  transactions: '...',
  epoch: '...',
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
        shards: parseInt(data.shards).toLocaleString('en'),
        blocks: parseInt(data.blocks).toLocaleString('en'),
        accounts: parseInt(data.accounts).toLocaleString('en'),
        transactions: parseInt(data.transactions).toLocaleString('en'),
        epoch: String(data.epoch),
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
