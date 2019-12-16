import * as React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
const PercentegeBar = ({
  totalUpTimePercentege,
  totalDownTimePercentege,
  totalUpTimeLabel,
  totalDownTimeLabel,
}: {
  totalUpTimePercentege: number;
  totalDownTimePercentege: number;
  totalUpTimeLabel: string;
  totalDownTimeLabel: string;
}) => (
  <div>
    {totalUpTimePercentege + totalDownTimePercentege > 0 ? (
      <div className="progress">
        <OverlayTrigger
          placement="top"
          delay={{ show: 250, hide: 400 }}
          overlay={(props: any) => (
            <Tooltip id={totalUpTimeLabel} {...props} show={props.show.toString()}>
              {totalUpTimeLabel}
            </Tooltip>
          )}
        >
          <div
            className="progress-bar bg-success"
            id={totalUpTimeLabel + totalUpTimePercentege.toString()}
            style={{ width: totalUpTimePercentege + '%' }}
          />
        </OverlayTrigger>
        <OverlayTrigger
          placement="top"
          delay={{ show: 250, hide: 400 }}
          overlay={(props: any) => (
            <Tooltip id={totalDownTimeLabel} {...props} show={props.show.toString()}>
              {totalDownTimeLabel}
            </Tooltip>
          )}
        >
          <div
            className="progress-bar bg-danger"
            id={totalDownTimeLabel + totalDownTimePercentege.toString()}
            style={{ width: totalDownTimePercentege + '%' }}
          />
        </OverlayTrigger>
      </div>
    ) : (
      <div className="progress">
        <div className="progress-bar bg-success" />
      </div>
    )}
  </div>
);
export default PercentegeBar;
