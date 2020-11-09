import moment from 'moment';
import { NodeType } from 'context/state';

export default function getUptimeDowntime(node: NodeType) {
  const totalTime = node.totalDownTimeSec + node.totalUpTimeSec;
  const totalDownTimePercentege = (node.totalDownTimeSec * 100) / totalTime;
  const totalUpTimePercentege = (node.totalUpTimeSec * 100) / totalTime;

  const totalUpTimeLabel =
    totalUpTimePercentege.toFixed(2) +
    '% (' +
    moment.duration({ seconds: node.totalUpTimeSec }).humanize() +
    ')'; // eslint-disable-line

  const totalDownTimeLabel =
    totalDownTimePercentege.toFixed(2) +
    '% (' +
    moment.duration({ seconds: node.totalDownTimeSec }).humanize() +
    ')'; // eslint-disable-line

  return { totalDownTimePercentege, totalUpTimePercentege, totalUpTimeLabel, totalDownTimeLabel };
}
