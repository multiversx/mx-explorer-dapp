import * as React from 'react';
import { useGlobalState } from '../../context';
import { ValidatorStatisticsData } from './../Validators/helpers/validatorHelpers';
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
  nrLeaderSuccess,
  nrLeaderFailure,
  nrValidatorSuccess,
  nrValidatorFailure,
}: NetworkMetricsType & ValidatorStatisticsData) => {
  const {
    activeTestnet: { validatorStatistics },
  } = useGlobalState();
  const leaderPercentage =
    nrLeaderSuccess !== 0 || nrLeaderFailure !== 0
      ? Math.floor((nrLeaderSuccess * 100) / (nrLeaderSuccess + nrLeaderFailure))
      : 0;
  const validatorPercentage =
    nrValidatorSuccess !== 0 || nrValidatorFailure !== 0
      ? Math.floor((nrValidatorSuccess * 100) / (nrValidatorSuccess + nrValidatorFailure))
      : 0;

  const cardBodyClassValidatorStatistics = validatorStatistics
    ? 'card-body mt-2 mb-2'
    : 'card-body mt-4 mb-4';
  const cardBodyClass = isValidator ? cardBodyClassValidatorStatistics : 'card-body';

  const labelClass = validatorStatistics ? 'col-lg-3 card-label' : 'col-lg-2 card-label';
  const dataClass = validatorStatistics ? 'col-lg-9' : 'col-lg-10';
  return (
    <>
      <div className="mt-4">
        <h4>Network Metrics</h4>
      </div>
      <div className="card" style={{ height: 'auto' }}>
        <div className={cardBodyClass}>
          <div className="row">
            <div className={labelClass}>Status</div>
            <div className={dataClass}>
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
            <div className={labelClass}>Uptime</div>
            <div className={dataClass}>
              <PercentegeBar
                totalDownTimeLabel={totalDownTimeLabel}
                totalUpTimeLabel={totalUpTimeLabel}
                totalUpTimePercentege={totalUpTimePercentege}
                totalDownTimePercentege={totalDownTimePercentege}
              />
            </div>
          </div>
          {validatorStatistics && (
            <>
              <hr className="hr-space" />
              <div className="row">
                <div className="col-lg-3 card-label">Leader Success</div>
                <div className="col-lg-9">
                  <PercentegeBar
                    totalDownTimeLabel={`${100 - leaderPercentage}% failure (${nrLeaderFailure})`}
                    totalUpTimeLabel={`${leaderPercentage}% success (${nrLeaderSuccess})`}
                    totalUpTimePercentege={leaderPercentage}
                    totalDownTimePercentege={100 - leaderPercentage}
                  />
                </div>
              </div>
              <hr className="hr-space" />
              <div className="row">
                <div className="col-lg-3 card-label">Validator Success</div>
                <div className="col-lg-9">
                  <PercentegeBar
                    totalDownTimeLabel={`${100 -
                      validatorPercentage}% failure (${nrValidatorFailure})`}
                    totalUpTimeLabel={`${validatorPercentage}% success (${nrValidatorSuccess})`}
                    totalUpTimePercentege={validatorPercentage}
                    totalDownTimePercentege={100 - validatorPercentage}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default NetworkMetrics;
