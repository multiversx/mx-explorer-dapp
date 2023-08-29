import { OverlayTrigger, Tooltip } from 'react-bootstrap';

export const PercentageBar = ({
  uptimePercentage,
  downtimePercentage,
  uptimeLabel,
  downtimeLabel,
  tooltipPlacementUp = true
}: {
  uptimePercentage: number;
  downtimePercentage: number;
  uptimeLabel: string;
  downtimeLabel: string;
  tooltipPlacementUp?: boolean;
}) => {
  const placement = tooltipPlacementUp ? 'top' : 'bottom';

  return (
    <div className='d-flex h-100 align-items-center py-2'>
      <div className='progress progress-sm w-100 m-0'>
        {uptimePercentage + downtimePercentage > 0 ? (
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
                id={uptimeLabel + uptimePercentage.toString()}
                style={{ width: uptimePercentage + '%' }}
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
                id={downtimeLabel + downtimePercentage.toString()}
                style={{ width: downtimePercentage + '%' }}
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
