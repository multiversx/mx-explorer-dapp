import * as React from 'react';
import BigNumber from 'bignumber.js';
import { Denominate } from 'sharedComponents';
import { DelegationType, ProviderType } from 'helpers/types';
import { useGlobalState } from 'context';

import ProviderDetails from './ProviderDetails';
import DetailsBlock from 'components/AccountDetails/AccountStaking/DetailsBlock';

const AccountDelegation = ({
  delegation,
  provider,
}: {
  delegation: DelegationType;
  provider: ProviderType;
}) => {
  const {
    activeNetwork: { erdLabel },
  } = useGlobalState();

  const { userActiveStake } = delegation;
  const claimableRewards = delegation.claimableRewards || '0';

  const undelegatedAmounts =
    delegation?.userUndelegatedList?.length > 0
      ? delegation.userUndelegatedList.map(({ amount }) => amount)
      : [];
  const bNtotalUserUnStakedValue =
    undelegatedAmounts.length > 0
      ? undelegatedAmounts.reduce((a, b) => new BigNumber(a).plus(b), new BigNumber('0'))
      : null;

  return (
    <div className="delegation-row d-flex flex-wrap align-items-center justify-content-between p-3 px-md-4">
      <ProviderDetails provider={provider} />

      {userActiveStake !== '0' && (
        <DetailsBlock>
          <strong>
            <Denominate value={userActiveStake} />
          </strong>
          <small>Amount Staked</small>
        </DetailsBlock>
      )}

      {bNtotalUserUnStakedValue && (
        <DetailsBlock>
          <strong>
            <Denominate value={bNtotalUserUnStakedValue.toString(10)} />
          </strong>
          <small>Undelegated</small>
        </DetailsBlock>
      )}

      <DetailsBlock>
        <strong>
          {claimableRewards ? <Denominate value={claimableRewards} /> : <>0 {erdLabel}</>}
        </strong>
        <small>Rewards</small>
      </DetailsBlock>
    </div>
  );
};

export default AccountDelegation;
