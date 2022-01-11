import * as React from 'react';
import { DetailItem, Led } from 'sharedComponents';
import PercentegeBar from './PercentegeBar';
import getUptimeDowntime from './getUptimeDowntime';
import { NodeType } from 'context/state';
import RatingArrow from './ratingArrow';

const NetworkMetrics = ({ node }: { node: NodeType }) => {
  const { uptimeLabel, downtimeLabel } = getUptimeDowntime(node);
  const statusColor = node.online ? 'success' : 'danger';

  return (
    <div className="card network-metrics">
      <div className="card-header">
        <div className="card-header-item">
          <h6 className="m-0">Network Metrics</h6>
        </div>
      </div>

      <div className="card-body p-0">
        <div className="container-fluid">
          <DetailItem title="Rating" colWidth="3">
            <div className="d-flex align-items-center h-100">
              <div className="gradient-bar progress progress-sm w-100 my-2">
                <RatingArrow node={node} showTemp={true} />
                <RatingArrow node={node} />
              </div>
            </div>
          </DetailItem>
          {/* <DetailItem title="Uptime" colWidth="3">
            <PercentegeBar
              downtimeLabel={downtimeLabel}
              uptimeLabel={uptimeLabel}
              uptimePercentege={node.uptime ? node.uptime : 0}
              downtimePercentege={node.downtime ? node.downtime : 0}
              tooltipPlacementUp={false}
            />
          </DetailItem> */}

          <DetailItem title="Status" colWidth="3">
            <div className="d-flex align-items-center">
              <Led color={`bg-${statusColor}`} />
              <span className={`ml-2 text-${statusColor}`}>
                {node.online ? 'online' : 'offline'}
              </span>
            </div>
          </DetailItem>
        </div>
      </div>
    </div>
  );
};

export default NetworkMetrics;
