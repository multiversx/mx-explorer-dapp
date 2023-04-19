import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

export const PercentageBar = ({
  overallPercent,
  fillPercent,
  fillPercentLabel,
  type
}: {
  overallPercent: number;
  fillPercent: number;
  fillPercentLabel: string;
  type?: string;
}) => (
  <div
    className={`d-flex h-100 align-items-center percentage-bar ${
      type === 'small' ? 'small' : ''
    }`}
  >
    {overallPercent + fillPercent > 0 ? (
      <div className='progress progress-sm w-100 my-2'>
        <div
          className='progress-bar existing'
          data-testid='progresUpTimeBar'
          id={overallPercent.toString()}
          style={{ width: overallPercent + '%' }}
        />

        <OverlayTrigger
          placement='top'
          delay={{ show: 0, hide: 400 }}
          overlay={(props: any) => (
            <Tooltip
              id={fillPercentLabel}
              {...props}
              show={props.show.toString()}
            >
              {fillPercentLabel}
            </Tooltip>
          )}
        >
          <div
            className='progress-bar new'
            data-testid='progresDownTimeBar'
            id={fillPercentLabel + fillPercent.toString()}
            style={{ width: fillPercent + '%' }}
          />
        </OverlayTrigger>
      </div>
    ) : (
      <div className='progress progress-sm w-100 my-2'>
        <div className='progress-bar existing' />
      </div>
    )}
  </div>
);
