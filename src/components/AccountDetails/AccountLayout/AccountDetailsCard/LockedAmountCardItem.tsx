import React from 'react';
import { faLock } from '@fortawesome/pro-solid-svg-icons/faLock';
import { CardItem, Denominate, LockedAmountTooltip } from 'sharedComponents';
import useFetchStakingDetails from 'helpers/useFetchStakingDetails';

const LockedDetails = ({ cardItemClass }: { cardItemClass: string }) => {
  const {
    stakingDataReady,
    bNtotalStaked,
    bNtotalDelegation,
    bNtotalLegacyDelegation,
    bNtotalLocked,
    bNtotalClaimable,
  } = useFetchStakingDetails();

  return (
    <CardItem className={cardItemClass} title="Stake" icon={faLock}>
      <div className="d-flex align-items-center">
        {stakingDataReady ? (
          <span className="mr-2">
            <Denominate value={bNtotalLocked.toString(10)} />
          </span>
        ) : (
          <>...</>
        )}
        {stakingDataReady && (
          <LockedAmountTooltip
            lockedDetails={[
              {
                label: 'Stake',
                value: <Denominate value={bNtotalStaked.toString(10)} />,
              },
              {
                label: 'Delegation',
                value: <Denominate value={bNtotalDelegation.toString(10)} />,
              },
              {
                label: 'Legacy Delegation',
                value: <Denominate value={bNtotalLegacyDelegation.toString(10)} />,
              },
              {
                label: 'Claimable Rewards',
                value: <Denominate value={bNtotalClaimable.toString(10)} />,
              },
            ]}
          />
        )}
      </div>
    </CardItem>
  );
};

export default LockedDetails;
