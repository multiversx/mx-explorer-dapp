import moment from 'moment';
import { ValidatorType } from './../components/Validators';

export function getShardId(validator: ValidatorType, metaChainShardId: number) {
  let shardId: string;
  let star = false;
  if (validator.isValidator === true) {
    shardId = validator.computedShardID.toString();
    if (validator.isActive === true && validator.computedShardID !== validator.receivedShardID) {
      star = true;
    }
  } else {
    shardId = validator.receivedShardID.toString();
  }
  return {
    shardId: shardId === metaChainShardId.toString() ? 'Metachain' : shardId, // eslint-disable-line
    shardNumber: parseInt(shardId), // this is excluding the Metachain string, used for searching
    star: star,
  };
}

export function getUptimeDowntime(validator: ValidatorType) {
  const totalTime = validator.totalDownTimeSec + validator.totalUpTimeSec;
  const totalDownTimePercentege = (validator.totalDownTimeSec * 100) / totalTime;
  const totalUpTimePercentege = (validator.totalUpTimeSec * 100) / totalTime;

  const totalUpTimeLabel =
    totalUpTimePercentege.toFixed(2) +
    '% (' +
    moment.duration({ seconds: validator.totalUpTimeSec }).humanize() +
    ')'; // eslint-disable-line

  const totalDownTimeLabel =
    totalDownTimePercentege.toFixed(2) +
    '% (' +
    moment.duration({ seconds: validator.totalDownTimeSec }).humanize() +
    ')'; // eslint-disable-line

  return { totalDownTimePercentege, totalUpTimePercentege, totalUpTimeLabel, totalDownTimeLabel };
}
