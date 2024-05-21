import { InfoTooltip } from 'components';

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
    <InfoTooltip
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
      tooltipClassName='locked-amount-tooltip'
      className='text-neutral-500'
      persistent
    />
  );
};
