import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/pro-regular-svg-icons/faInfoCircle';

interface LockedItemType {
  label: string;
  value: React.ReactNode;
}

const LockedAmountTooltip = ({ lockedDetails }: { lockedDetails: LockedItemType[] }) => {
  return (
    <OverlayTrigger
      placement="bottom"
      delay={{ show: 0, hide: 400 }}
      overlay={(props: any) => (
        <Tooltip id="locked-amount-tooltip" {...props} show={props.show.toString()}>
          {lockedDetails.map(({ label, value }) => (
            <div className="locked-item">
              <span className="locked-item-label">{label}</span>
              <span className="text-secondary">{value}</span>
            </div>
          ))}
        </Tooltip>
      )}
    >
      <FontAwesomeIcon icon={faInfoCircle} size="1x" className="text-primary" />
    </OverlayTrigger>
  );
};

export default LockedAmountTooltip;
