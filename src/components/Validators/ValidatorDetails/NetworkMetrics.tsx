import * as React from 'react';
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
  const cardBodyClass = isValidator ? 'card-body mt-1 mb-1' : 'card-body';

  return (
    <>
      <div className="mt-4">
        <h4>Network Metrics</h4>
      </div>
      <div className="card" style={{ height: 'auto' }}>
        <div className={cardBodyClass}>
          <div className="row">
            <div className="col-lg-3 card-label">Rating</div>
            <div className="col-lg-9">
              {!isNaN(rating) ? rating : <span className="text-muted">N/A</span>}
            </div>
          </div>
          <hr className="hr-space" />

          <div className="row">
            <div className="col-lg-3 card-label">Uptime</div>
            <div className="col-lg-9">
              <PercentegeBar
                totalDownTimeLabel={totalDownTimeLabel}
                totalUpTimeLabel={totalUpTimeLabel}
                totalUpTimePercentege={totalUpTimePercentege}
                totalDownTimePercentege={totalDownTimePercentege}
              />
            </div>
          </div>
          <hr className="hr-space" />
          <div className="row">
            <div className="col-lg-3 card-label">Status</div>
            <div className="col-lg-9">
              {isActive ? (
                <div>
                  <span className="badge badge-pill badge-success badge-status">&nbsp;</span>
                  <span>&nbsp;Online</span>
                </div>
              ) : (
                <div>
                  <span className="badge badge-pill badge-danger badge-status">&nbsp;</span>
                  <span className={isValidator === false ? 'text-muted' : ''}>&nbsp;Offline</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NetworkMetrics;
