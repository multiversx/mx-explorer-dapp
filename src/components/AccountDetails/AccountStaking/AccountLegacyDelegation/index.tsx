import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeaf } from '@fortawesome/pro-regular-svg-icons';
import BigNumber from 'bignumber.js';
import { Denominate } from 'sharedComponents';
import { DelegationLegacyType, ProviderType } from 'helpers/types';
import { useGlobalState } from 'context';

import { ReactComponent as ElrondSymbol } from 'assets/images/elrond-symbol.svg';

import DetailsBlock from '../DetailsBlock';

const AccountLegacyDelegation = ({
  delegationLegacy,
  elrondNodes,
}: {
  delegationLegacy: DelegationLegacyType;
  elrondNodes?: ProviderType;
}) => {
  const {
    activeNetwork: { erdLabel },
    economics,
  } = useGlobalState();

  const {
    userActiveStake,
    claimableRewards,
    userUnstakedStake,
    userWaitingStake,
  } = delegationLegacy;

  const [legacyDelegationApr, setLegacyDelegationApr] = React.useState<string>('...');

  const getLegacyDelegationApr = () => {
    if (
      economics.baseApr !== '...' &&
      economics.topUpApr !== '...' &&
      elrondNodes?.stake &&
      elrondNodes?.topUp &&
      elrondNodes?.locked
    ) {
      const legacyDelegationBN = new BigNumber(elrondNodes.stake)
        .times(new BigNumber(economics.baseApr))
        .plus(new BigNumber(elrondNodes.topUp).times(economics.topUpApr))
        .dividedBy(new BigNumber(elrondNodes.locked))
        .times(new BigNumber(100));

      setLegacyDelegationApr(`${legacyDelegationBN.toNumber().toFixed(2)}%`);
    } else {
      setLegacyDelegationApr('N/A');
    }
  };

  useEffect(getLegacyDelegationApr, [economics, elrondNodes]);

  return (
    <div className="delegation-row d-flex flex-wrap align-items-center justify-content-between p-3 px-md-4">
      <div className="provider-details">
        <div className="d-flex flex-row align-items-center">
          <div className="egld-icon provider-image has-avatar rounded-circle d-flex mr-3">
            <ElrondSymbol />
          </div>
          <div className="d-flex flex-column w-100">
            <div className="provider-title d-flex align-items-center">Elrond Legacy Delegation</div>

            <div className="d-flex flex-wrap provider-metrics">
              <div>
                <FontAwesomeIcon size="xs" icon={faLeaf} className="mr-1" />
                Up to {legacyDelegationApr}
                <span className="text-secondary ml-1">APY</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {userActiveStake && userActiveStake !== '0' && (
        <DetailsBlock>
          <strong>
            <Denominate value={new BigNumber(userActiveStake).toString(10)} />
          </strong>
          <small>Amount Delegated</small>
        </DetailsBlock>
      )}

      {userUnstakedStake && userUnstakedStake !== '0' && (
        <DetailsBlock>
          <strong>
            <Denominate value={new BigNumber(userUnstakedStake).toString(10)} />
          </strong>
          <small>Undelegated</small>
        </DetailsBlock>
      )}

      {userWaitingStake && userWaitingStake !== '0' && (
        <DetailsBlock>
          <strong>
            <Denominate value={new BigNumber(userWaitingStake).toString(10)} />
          </strong>
          <small>Waiting</small>
        </DetailsBlock>
      )}

      <DetailsBlock>
        <strong>
          {claimableRewards ? (
            <Denominate value={new BigNumber(claimableRewards).toString(10)} />
          ) : (
            <>0 {erdLabel}</>
          )}
        </strong>
        <small>Rewards</small>
      </DetailsBlock>
    </div>
  );
};

export default AccountLegacyDelegation;
