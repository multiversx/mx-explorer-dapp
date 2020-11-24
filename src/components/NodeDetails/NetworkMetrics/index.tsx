import * as React from 'react';
import { DetailItem, Led } from 'sharedComponents';
import PercentegeBar from './PercentegeBar';
import getUptimeDowntime from './getUptimeDowntime';
import { NodeType } from 'context/state';
import RatingArrow from './ratingArrow';

const NetworkMetrics = ({ node }: { node: NodeType }) => {
  const { totalUpTimeLabel, totalDownTimeLabel } = getUptimeDowntime(node);
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

          <DetailItem title="Uptime" colWidth="3">
            <PercentegeBar
              totalDownTimeLabel={totalDownTimeLabel}
              totalUpTimeLabel={totalUpTimeLabel}
              totalUpTimePercentege={node.totalUpTime ? node.totalUpTime : 0}
              totalDownTimePercentege={node.totalDownTime ? node.totalDownTime : 0}
              tooltipPlacementUp={false}
            />
          </DetailItem>

          <DetailItem title="Status" colWidth="3">
            <div className="d-flex align-items-center">
              <Led color={node.status === 'online' ? 'bg-success' : 'bg-danger'} />
              <span className="ml-2">{node.status === 'online' ? 'Online' : 'Offline'}</span>
            </div>
          </DetailItem>
        </div>
      </div>
    </div>
  );
};

export default NetworkMetrics;
