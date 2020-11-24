import * as React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const PercentegeBar = ({
  totalUpTimePercentege,
  totalDownTimePercentege,
  totalUpTimeLabel,
  totalDownTimeLabel,
  tooltipPlacementUp = true,
}: {
  totalUpTimePercentege: number;
  totalDownTimePercentege: number;
  totalUpTimeLabel: string;
  totalDownTimeLabel: string;
  tooltipPlacementUp?: boolean;
}) => {
  const placement = tooltipPlacementUp ? 'top' : 'bottom';

  return (
    <div className="d-flex h-100 align-items-center py-2">
      <div className="progress progress-sm w-100 m-0">
        {totalUpTimePercentege + totalDownTimePercentege > 0 ? (
          <>
            <OverlayTrigger
              placement={placement}
              delay={{ show: 0, hide: 400 }}
              overlay={(props: any) => (
                <Tooltip id={totalUpTimeLabel} {...props} show={props.show.toString()}>
                  {totalUpTimeLabel}
                </Tooltip>
              )}
            >
              <div
                className="progress-bar bg-success"
                data-testid="progresUpTimeBar"
                id={totalUpTimeLabel + totalUpTimePercentege.toString()}
                style={{ width: totalUpTimePercentege + '%' }}
              />
            </OverlayTrigger>
            <OverlayTrigger
              placement={placement}
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
          </>
        ) : (
          <div className="progress-bar bg-success" />
        )}
      </div>
    </div>
  );
};
export default PercentegeBar;
