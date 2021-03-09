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
  <div className="d-flex h-100 align-items-center">
    {totalUpTimePercentege + totalDownTimePercentege > 0 ? (
      <div className="progress progress-sm w-100 my-2">
        <div
          className="progress-bar bg-success"
          data-testid="progresUpTimeBar"
          id={totalUpTimeLabel + totalUpTimePercentege.toString()}
          style={{ width: totalUpTimePercentege + '%' }}
        />

        <OverlayTrigger
          placement="top"
          delay={{ show: 0, hide: 400 }}
          overlay={(props: any) => (
            <Tooltip id={totalDownTimeLabel} {...props} show={props.show.toString()}>
              {totalDownTimeLabel}
            </Tooltip>
          )}
        >
          <div
            className="progress-bar bg-danger"
            data-testid="progresDownTimeBar"
            id={totalDownTimeLabel + totalDownTimePercentege.toString()}
            style={{ width: totalDownTimePercentege + '%' }}
          />
        </OverlayTrigger>
      </div>
    ) : (
      <div className="progress progress-sm w-100 my-2">
        <div className="progress-bar bg-success" />
      </div>
    )}
  </div>
);
export default PercentegeBar;
