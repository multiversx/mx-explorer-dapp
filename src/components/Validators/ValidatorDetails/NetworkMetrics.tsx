import * as React from 'react';
import { DetailItem, Led } from 'sharedComponents';
import PercentegeBar from './PercentegeBar';

export interface NetworkMetricsType {
  isValidator: boolean;
  isActive: boolean;
  totalUpTimePercentege: number;
  totalDownTimePercentege: number;
  totalUpTimeLabel: string;
  totalDownTimeLabel: string;
}

const NetworkMetrics = ({
  isValidator,
  isActive,
  totalUpTimePercentege,
  totalDownTimePercentege,
  totalUpTimeLabel,
  totalDownTimeLabel,
  rating,
}: NetworkMetricsType & { rating: number }) => {
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
            {!isNaN(rating) ? rating : <span className="text-muted">N/A</span>}
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
              <Led color={isActive ? 'bg-success' : 'bg-danger'} />
              <span className="ml-2">{isActive ? 'Online' : 'Offline'}</span>
            </div>
          </DetailItem>
        </div>
      </div>
    </div>
  );
};

export default NetworkMetrics;
