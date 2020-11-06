import * as React from 'react';
import { DetailItem, Led } from 'sharedComponents';
import PercentegeBar from './PercentegeBar';
import getUptimeDowntime from './getUptimeDowntime';
import { ValidatorType } from 'context/validators';

export interface NetworkMetricsType {
  node: ValidatorType;
}

const NetworkMetrics = ({ node }: NetworkMetricsType) => {
  const {
    totalUpTimePercentege,
    totalDownTimePercentege,
    totalUpTimeLabel,
    totalDownTimeLabel,
  } = getUptimeDowntime(node);
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-header-item">
          <h6 className="m-0">Network Metrics</h6>
        </div>
      </div>

      <div className="card-body p-0">
        <div className="container-fluid">
          <DetailItem title="Rating" colWidth="3">
            {!isNaN(node.rating) ? node.rating : <span className="text-muted">N/A</span>}
          </DetailItem>

          <DetailItem title="Uptime" colWidth="3">
            <PercentegeBar
              totalDownTimeLabel={totalDownTimeLabel}
              totalUpTimeLabel={totalUpTimeLabel}
              totalUpTimePercentege={totalUpTimePercentege}
              totalDownTimePercentege={totalDownTimePercentege}
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
