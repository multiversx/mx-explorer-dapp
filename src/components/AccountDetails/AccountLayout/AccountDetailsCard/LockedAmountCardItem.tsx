import React from 'react';
import BigNumber from 'bignumber.js';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { faInfoCircle } from '@fortawesome/pro-regular-svg-icons/faInfoCircle';
import { faLock } from '@fortawesome/pro-solid-svg-icons/faLock';
import { useGlobalState } from 'context';
import { LockedAmountType } from './index';
import { CardItem, Denominate } from 'sharedComponents';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const LockedDetails = ({
  lockedAmount,
  cardItemClass,
}: {
  lockedAmount: LockedAmountType;
  cardItemClass: string;
}) => {
  const { accountDetails } = useGlobalState();
  const bNClaimableRewards = new BigNumber(
    accountDetails.claimableRewards ? accountDetails.claimableRewards : 0
  );

  const {
    totalStaked,
    userActiveStake,
    // userDeferredPaymentStake,
    // userUnstakedStake,
    userWaitingStake,
    // userWithdrawOnlyStake,
  } = lockedAmount;

  const bNtotalStaked = new BigNumber(totalStaked ? totalStaked : 0);
  const bNuserActiveStake = new BigNumber(userActiveStake ? userActiveStake : 0);
  const bNuserWaitingStake = new BigNumber(userWaitingStake ? userWaitingStake : 0);
  const totalLocked = bNClaimableRewards
    .plus(bNtotalStaked)
    .plus(bNuserActiveStake)
    .plus(bNuserWaitingStake);

  const show = lockedAmount.delegationFetched && lockedAmount.stakeFetched;

  return (
    <CardItem className={cardItemClass} title="Locked" icon={faLock}>
      <div className="d-flex align-items-center">
        <span className="mr-2">
          {show ? <Denominate value={totalLocked.toString(10)} /> : <>...</>}
        </span>

        {show && (
          <OverlayTrigger
            placement="bottom"
            delay={{ show: 0, hide: 400 }}
            overlay={(props: any) => (
              <Tooltip id="locked-amount-details" {...props} show={props.show.toString()}>
                <div className="locked-item">
                  <span className="locked-item-label">Stake</span>
                  <span className="text-secondary">
                    <Denominate value={bNtotalStaked.toString(10)} />
                  </span>
                </div>

                <div className="locked-item">
                  <span className="locked-item-label">Active Delegation</span>
                  <span className="text-secondary">
                    <Denominate value={bNuserActiveStake.toString(10)} />
                  </span>
                </div>

                <div className="locked-item">
                  <span className="locked-item-label">Waiting Delegation</span>
                  <span className="text-secondary">
                    <Denominate value={bNuserWaitingStake.toString(10)} />
                  </span>
                </div>

                <div className="locked-item">
                  <span className="locked-item-label">Claimable Rewards</span>
                  <span className="text-secondary">
                    <Denominate value={bNClaimableRewards.toString(10)} />
                  </span>
                </div>
              </Tooltip>
            )}
          >
            <FontAwesomeIcon icon={faInfoCircle} size="1x" className="text-primary" />
          </OverlayTrigger>
        )}
      </div>
    </CardItem>
  );
};

export default LockedDetails;
