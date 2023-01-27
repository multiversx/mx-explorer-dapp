import * as React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

export const PercentegeBar = ({
  uptimePercentege,
  downtimePercentege,
  uptimeLabel,
  downtimeLabel,
  tooltipPlacementUp = true
}: {
  uptimePercentege: number;
  downtimePercentege: number;
  uptimeLabel: string;
  downtimeLabel: string;
  tooltipPlacementUp?: boolean;
}) => {
  const placement = tooltipPlacementUp ? 'top' : 'bottom';

  return (
    <div className='d-flex h-100 align-items-center py-2'>
      <div className='progress progress-sm w-100 m-0'>
        {uptimePercentege + downtimePercentege > 0 ? (
          <>
            <OverlayTrigger
              placement={placement}
              delay={{ show: 0, hide: 400 }}
              overlay={(props: any) => (
                <Tooltip
                  id={uptimeLabel}
                  {...props}
                  show={props.show.toString()}
                >
                  {uptimeLabel}
                </Tooltip>
              )}
            >
              <div
                className='progress-bar existing'
                data-testid='progresUpTimeBar'
                id={uptimeLabel + uptimePercentege.toString()}
                style={{ width: uptimePercentege + '%' }}
              />
            </OverlayTrigger>
            <OverlayTrigger
              placement={placement}
              delay={{ show: 0, hide: 400 }}
              overlay={(props: any) => (
                <Tooltip
                  id={downtimeLabel}
                  {...props}
                  show={props.show.toString()}
                >
                  {downtimeLabel}
                </Tooltip>
              )}
            >
              <div
                className='progress-bar new'
                data-testid='progresDownTimeBar'
                id={downtimeLabel + downtimePercentege.toString()}
                style={{ width: downtimePercentege + '%' }}
              />
            </OverlayTrigger>
          </>
        ) : (
          <div className='progress-bar existing' />
        )}
      </div>
    </div>
  );
};
