import React from 'react';
import { faInfoCircle } from '@fortawesome/pro-regular-svg-icons/faInfoCircle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

interface LockedItemType {
  label: string;
  value: React.ReactNode;
}

export const LockedAmountTooltip = ({
  lockedDetails,
  small
}: {
  lockedDetails: LockedItemType[];
  small?: boolean;
}) => {
  return (
    <OverlayTrigger
      placement='bottom'
      delay={{ show: 0, hide: 400 }}
      overlay={(props: any) => (
        <Tooltip
          id='locked-amount-tooltip'
          {...props}
          show={props.show.toString()}
        >
          {lockedDetails.map(({ label, value }, i) => (
            <div
              key={i}
              className={`locked-item ${small ? 'small-labels' : ''}`}
            >
              <span className='locked-item-label text-neutral-400'>
                {label}
              </span>
              <span>{value}</span>
            </div>
          ))}
        </Tooltip>
      )}
    >
      <FontAwesomeIcon icon={faInfoCircle} size='1x' className='text-primary' />
    </OverlayTrigger>
  );
};
