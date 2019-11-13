import * as React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

export type NetworkMetricsType = {
  isValidator: boolean;
  isActive: boolean;
  totalUpTimePercentege: number;
  totalDownTimePercentege: number;
  totalUpTimeLabel: string;
  totalDownTimeLabel: string;
};

const NetworkMetrics = ({
  isValidator,
  isActive,
  totalUpTimePercentege,
  totalDownTimePercentege,
  totalUpTimeLabel,
  totalDownTimeLabel,
}: NetworkMetricsType) => {
  return (
    <>
      <div className="mt-4">
        <h4>Network Metrics</h4>
      </div>
      <div className="card" style={{ height: 'auto' }}>
        <div className={isValidator ? 'card-body mt-2 mb-3' : 'card-body'}>
          <div className="row">
            <div className="col-lg-2 card-label">Status</div>
            <div className="col-lg-10">
              {isActive ? (
                <div ng-if="isActive === true">
                  <span className="badge badge-pill badge-success badge-status">&nbsp;</span>
                  <span>&nbsp;Online</span>
                </div>
              ) : (
                <div ng-if="isActive === false">
                  <span className="badge badge-pill badge-danger badge-status">&nbsp;</span>
                  <span className={isValidator === false ? 'text-muted' : ''}>&nbsp;Offline</span>
                </div>
              )}
            </div>
          </div>
          <hr className="hr-space" />
          <div className="row">
            <div className="col-lg-2 card-label">Uptime</div>
            <div className="col-lg-10">
              {totalUpTimePercentege + totalDownTimePercentege > 0 ? (
                <div className="progress">
                  <OverlayTrigger
                    placement="top"
                    delay={{ show: 250, hide: 400 }}
                    overlay={(props: any) => (
                      <Tooltip id="totalUpTimeLabel" {...props}>
                        {totalUpTimeLabel}
                      </Tooltip>
                    )}
                  >
                    <div
                      className="progress-bar bg-success"
                      style={{ width: totalUpTimePercentege + '%' }}
                      id="upTimePercentegeBar"
                    ></div>
                  </OverlayTrigger>
                  <OverlayTrigger
                    placement="top"
                    delay={{ show: 250, hide: 400 }}
                    overlay={(props: any) => (
                      <Tooltip id="totalDownTimeLabel" {...props}>
                        {totalDownTimeLabel}
                      </Tooltip>
                    )}
                  >
                    <div
                      className="progress-bar bg-danger"
                      style={{ width: totalDownTimePercentege + '%' }}
                      id="downTimePercentegeBar"
                    ></div>
                  </OverlayTrigger>
                </div>
              ) : (
                <div className="progress">
                  <div
                    className="progress-bar bg-success"
                    ng-style="{width: '100%'}"
                    id="upTimePercentegeBar"
                  ></div>
                </div>
              )}
            </div>
          </div>
          {/* {code && (
                          <>
                            <hr className="hr-space" />
                            <div className="row">
                              <div className="col-lg-2 card-label">Code</div>
                              <div className="col-lg-10">
                                <textarea
                                  readOnly
                                  className="form-control col-lg-12 cursor-text"
                                  rows={2}
                                  defaultValue={"{{code ? code : ''}}"}
                                />
                              </div>
                            </div>
                          </>
                        )} */}
        </div>
      </div>
    </>
  );
};

export default NetworkMetrics;
