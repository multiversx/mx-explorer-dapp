import React from 'react';
import { CardItem, CopyButton, Denominate } from 'sharedComponents';
import { NavDropdown } from 'react-bootstrap';
import { useGlobalState } from 'context';
import { ReactComponent as ElrondSymbol } from 'assets/images/elrond-symbol-chart.svg';
import { faInfoCircle } from '@fortawesome/pro-solid-svg-icons/faInfoCircle';
import { faDollarSign } from '@fortawesome/pro-solid-svg-icons/faDollarSign';
import { faLock } from '@fortawesome/pro-solid-svg-icons/faLock';
import { faUser } from '@fortawesome/pro-solid-svg-icons/faUser';
import { faCoins } from '@fortawesome/pro-solid-svg-icons/faCoins';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import denominate from 'sharedComponents/Denominate/denominate';
import { denomination, decimals } from 'appConfig';
import BigNumber from 'bignumber.js';

const LockedDetails = ({ cardItemClass }: { cardItemClass: string }) => {
  const { accountDetails } = useGlobalState();

  // TODO find a better way?
  if (!accountDetails) {
    return null;
  }

  const {
    totalStaked,
    claimableRewards,
    userActiveStake,
    userDeferredPaymentStake,
    userUnstakedStake,
    userWaitingStake,
    userWithdrawOnlyStake,
  } = accountDetails;

  // const rewards = parseFloat(
  //   denominate({
  //     input: claimableRewards,
  //     decimals,
  //     denomination,
  //     showLastNonZeroDecimal: false,
  //     addCommas: false,
  //   })
  // );

  const bNtotalStaked = new BigNumber(totalStaked ? totalStaked : 0);
  const bNuserActiveStake = new BigNumber(userActiveStake ? userActiveStake : 0);
  const bNuserWaitingStake = new BigNumber(userWaitingStake ? userWaitingStake : 0);

  const totalLocked = bNtotalStaked.plus(bNuserActiveStake).plus(bNuserWaitingStake);

  return (
    <CardItem className={`overflow-visible ${cardItemClass}`} title="Locked" icon={faLock}>
      <div className="d-flex align-items-center">
        <span className="mr-2">
          <Denominate value={totalLocked.toString(10)} />
        </span>

        <NavDropdown
          title={<FontAwesomeIcon icon={faInfoCircle} size="1x" className="text-primary" />}
          id="locked-amount-details"
        >
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
        </NavDropdown>
      </div>
    </CardItem>
  );
};

const AccountInfo = () => {
  const {
    activeNetwork: { erdLabel, id, adapter },
    accountDetails,
  } = useGlobalState();

  // TODO find a better way?
  if (!accountDetails) {
    return null;
  }

  const { address, balance, nonce } = accountDetails;

  const tokensActive = id !== 'mainnet' && adapter === 'api';
  const cardItemClass = tokensActive ? 'n5' : '';

  return (
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

            <LockedDetails cardItemClass={cardItemClass} />

            <CardItem className={cardItemClass} title="Nonce" icon={faUser}>
              {nonce}
            </CardItem>

            {tokensActive && (
              <CardItem className={cardItemClass} title="Tokens" icon={faCoins}>
                [WIP]
              </CardItem>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountInfo;
