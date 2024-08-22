import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BigNumber from 'bignumber.js';
import { useSelector } from 'react-redux';

import { ELLIPSIS } from 'appConstants';
import { ReactComponent as MultiversXSymbol } from 'assets/img/multiversx-legacy-delegation.svg';
import { FormatAmount } from 'components';
import { faLeaf } from 'icons/regular';
import { activeNetworkSelector, economicsSelector } from 'redux/selectors';
import { AccountDelegationLegacyType, IdentityType } from 'types';

import { DetailsBlock } from '../DetailsBlock';

export const AccountLegacyDelegation = ({
  legacyDelegation,
  identity
}: {
  legacyDelegation: AccountDelegationLegacyType;
  identity?: IdentityType;
}) => {
  const {
    isFetched,
    unprocessed: { baseApr, topUpApr }
  } = useSelector(economicsSelector);
  const { egldLabel } = useSelector(activeNetworkSelector);

  const {
    userActiveStake,
    claimableRewards,
    userUnstakedStake,
    userWaitingStake,
    userDeferredPaymentStake
  } = legacyDelegation;

  const [legacyDelegationApr, setLegacyDelegationApr] =
    useState<string>(ELLIPSIS);

  const getLegacyDelegationApr = () => {
    if (isFetched && identity?.stake && identity?.topUp && identity?.locked) {
      const legacyDelegationBN = new BigNumber(identity.stake)
        .times(new BigNumber(baseApr))
        .plus(new BigNumber(identity.topUp).times(topUpApr))
        .dividedBy(new BigNumber(identity.locked))
        .times(new BigNumber(100));

      setLegacyDelegationApr(`${legacyDelegationBN.toNumber().toFixed(2)}%`);
    } else {
      setLegacyDelegationApr('N/A');
    }
  };

  useEffect(getLegacyDelegationApr, [isFetched, identity]);

  return (
    <div className='delegation-row d-flex flex-wrap align-items-center justify-content-between p-3 px-md-4'>
      <div className='provider-details'>
        <div className='d-flex flex-row align-items-center'>
          <div className='multiversx-icon provider-image has-avatar rounded-circle d-flex me-3'>
            <MultiversXSymbol />
          </div>
          <div className='d-flex flex-column w-100'>
            <div className='provider-title font-headings d-flex align-items-center'>
              MultiversX Legacy Delegation
            </div>

            <div className='d-flex flex-wrap provider-metrics'>
              <div>
                <FontAwesomeIcon size='xs' icon={faLeaf} className='me-1' />
                Up to {legacyDelegationApr}
                <span className='text-neutral-400 ms-1'>APY</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {userActiveStake && userActiveStake !== '0' && (
        <DetailsBlock>
          <strong>
            <FormatAmount value={new BigNumber(userActiveStake).toString(10)} />
          </strong>
          <small>Amount Delegated</small>
        </DetailsBlock>
      )}

      {userUnstakedStake && userUnstakedStake !== '0' && (
        <DetailsBlock>
          <strong>
            <FormatAmount
              value={new BigNumber(userUnstakedStake).toString(10)}
            />
          </strong>
          <small>Undelegated</small>
        </DetailsBlock>
      )}

      {userDeferredPaymentStake && userDeferredPaymentStake !== '0' && (
        <DetailsBlock>
          <strong>
            <FormatAmount
              value={new BigNumber(userDeferredPaymentStake).toString(10)}
            />
          </strong>
          <small>Unbonded</small>
        </DetailsBlock>
      )}

      {userWaitingStake && userWaitingStake !== '0' && (
        <DetailsBlock>
          <strong>
            <FormatAmount
              value={new BigNumber(userWaitingStake).toString(10)}
            />
          </strong>
          <small>Waiting</small>
        </DetailsBlock>
      )}

      <DetailsBlock>
        <strong>
          {claimableRewards ? (
            <FormatAmount
              value={new BigNumber(claimableRewards).toString(10)}
            />
          ) : (
            <>0 {egldLabel}</>
          )}
        </strong>
        <small>Rewards</small>
      </DetailsBlock>
    </div>
  );
};
