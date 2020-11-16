import moment from 'moment';
import { NodeType } from 'context/state';

export default function getUptimeDowntime(node: NodeType) {
  const totalUpTimeLabel = node.totalUpTime
    ? `${node.totalUpTime.toFixed(2)}% (${moment
        .duration({ seconds: node.totalUpTimeSec })
        .humanize()})`
    : '';

  const totalDownTimeLabel = node.totalDownTime
    ? `${node.totalDownTime.toFixed(2)} (${moment
        .duration({ seconds: node.totalDownTimeSec })
        .humanize()})%`
    : '';

  return { totalUpTimeLabel, totalDownTimeLabel };
}
