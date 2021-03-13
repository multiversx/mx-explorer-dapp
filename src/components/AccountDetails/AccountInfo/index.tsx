import React from 'react';
import { CardItem, CopyButton, Denominate } from 'sharedComponents';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useGlobalState } from 'context';
import { ReactComponent as ElrondSymbol } from 'assets/images/elrond-symbol-chart.svg';
import { faInfoCircle } from '@fortawesome/pro-solid-svg-icons/faInfoCircle';
import { faDollarSign } from '@fortawesome/pro-solid-svg-icons/faDollarSign';
import { faLock } from '@fortawesome/pro-solid-svg-icons/faLock';
import { faUser } from '@fortawesome/pro-solid-svg-icons/faUser';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import denominate from 'sharedComponents/Denominate/denominate';
import { denomination, decimals } from 'appConfig';
import BigNumber from 'bignumber.js';
import { LockedAmountType } from '../AccountLayout';

const LockedDetails = ({
  lockedAmount,
  cardItemClass,
}: {
  lockedAmount: LockedAmountType;
  cardItemClass: string;
}) => {
  // const { accountDetails } = useGlobalState();
  // const claimableRewards = accountDetails ? accountDetails.claimableRewards : 0;
  // const rewards = parseFloat(
  //   denominate({
  //     input: claimableRewards,
  //     decimals,
  //     denomination,
  //     showLastNonZeroDecimal: false,
  //     addCommas: false,
  //   })
  // );

  const {
    totalStaked,
    userActiveStake,
    userDeferredPaymentStake,
    userUnstakedStake,
    userWaitingStake,
    userWithdrawOnlyStake,
  } = lockedAmount;

  const bNtotalStaked = new BigNumber(totalStaked ? totalStaked : 0);
  const bNuserActiveStake = new BigNumber(userActiveStake ? userActiveStake : 0);
  const bNuserWaitingStake = new BigNumber(userWaitingStake ? userWaitingStake : 0);
  const totalLocked = bNtotalStaked.plus(bNuserActiveStake).plus(bNuserWaitingStake);

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
                  <span className="locked-item-label">Stake</span>
                  <span className="text-secondary">
                    <Denominate value={bNtotalStaked.toString(10)} />
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

const AccountInfo = ({ lockedAmount }: { lockedAmount: LockedAmountType }) => {
  const {
    activeNetwork: { id, adapter },
    accountDetails,
  } = useGlobalState();

  const { address, balance, nonce } = accountDetails;
  const tokensActive = id !== 'mainnet' && adapter === 'api';
  const cardItemClass = tokensActive ? 'n5' : '';

  return address !== '' ? (
    <div className="row account-info">
      <div className="col mb-spacer">
        <div className="card">
          <div className="card-header">
            <div className="card-header-item">
              <h6 data-testid="title">Account Details</h6>
            </div>
            <div className="card-header-item compact d-flex">
              Address:
              <div className="d-flex align-items-center text-break-all ml-2 text-secondary">
                <span>{address}</span>
                <CopyButton text={address} />
              </div>
            </div>
          </div>

          <div className="card-body my-n2 d-flex flex-wrap flex-row">
            <CardItem className={cardItemClass} title="Balance" customIcon={<ElrondSymbol />}>
              <div className="d-flex align-items-center">
                {balance !== '...' ? <Denominate value={balance} /> : balance}
                <FontAwesomeIcon icon={faInfoCircle} size="1x" className="text-primary ml-2" />
              </div>
            </CardItem>

            <CardItem className={cardItemClass} title="Value" icon={faDollarSign}>
              {balance !== '...' ? <Denominate value={balance} /> : balance}
            </CardItem>

            <LockedDetails lockedAmount={lockedAmount} cardItemClass={cardItemClass} />

            <CardItem className={cardItemClass} title="Nonce" icon={faUser}>
              {nonce !== undefined ? nonce : '...'}
            </CardItem>

            {/* {tokensActive && (
              <CardItem className={cardItemClass} title="Tokens" icon={faCoins}>
                [WIP]
              </CardItem>
            )} */}
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default AccountInfo;
