import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Overlay } from 'components';
import { faInfoCircle } from 'icons/regular';

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
    <Overlay
      tooltipClassName='locked-amount-tooltip'
      title={
        <>
          {lockedDetails.map(({ label, value }, i) => (
            <div
              key={i}
              className={`locked-item d-flex ${small ? 'small-labels' : ''}`}
            >
              <span className='locked-item-label text-neutral-400'>
                {label}
              </span>
              <span>{value}</span>
            </div>
          ))}
        </>
      }
      persistent
    >
      <FontAwesomeIcon icon={faInfoCircle} size='1x' className='text-primary' />
    </Overlay>
  );
};
