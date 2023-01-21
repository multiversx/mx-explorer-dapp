import moment from 'moment';
import { NodeType } from 'helpers/types';

export const getUptimeDowntime = (node: NodeType) => {
  const uptimeLabel = node.uptime
    ? `${node.uptime.toFixed(2)}% (${moment.duration({ seconds: node.uptimeSec }).humanize()})`
    : '';

  const downtimeLabel = node.downtime
    ? `${node.downtime.toFixed(2)} (${moment.duration({ seconds: node.downtimeSec }).humanize()})%`
    : '';

  return { uptimeLabel, downtimeLabel };
};
