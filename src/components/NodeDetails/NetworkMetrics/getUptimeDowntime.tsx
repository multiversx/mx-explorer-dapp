import moment from 'moment';
import { NodeType } from 'context/state';

export default function getUptimeDowntime(node: NodeType) {
  const uptimeLabel = node.uptime
    ? `${node.uptime.toFixed(2)}% (${moment.duration({ seconds: node.uptimeSec }).humanize()})`
    : '';

  const downtimeLabel = node.downtime
    ? `${node.downtime.toFixed(2)} (${moment.duration({ seconds: node.downtimeSec }).humanize()})%`
    : '';

  return { uptimeLabel, downtimeLabel };
}
