import BigNumber from 'bignumber.js';
import { useSelector } from 'react-redux';

import { ZERO } from 'appConstants';
import { FormatAmount } from 'components';
import { activeNetworkSelector } from 'redux/selectors';
import { AccountDelegationType, ProviderType } from 'types';

import { DetailsBlock } from '../DetailsBlock';
import { ProviderDetails } from '../ProviderDetails';

export const AccountDelegation = ({
  delegation,
  provider
}: {
  delegation: AccountDelegationType;
  provider: ProviderType;
}) => {
  const { egldLabel } = useSelector(activeNetworkSelector);

  const { userActiveStake } = delegation;
  const claimableRewards = delegation.claimableRewards || ZERO;

  const undelegatedAmounts =
    delegation?.userUndelegatedList && delegation.userUndelegatedList.length > 0
      ? delegation.userUndelegatedList.map(({ amount }) => amount)
      : [];
  const bNtotalUserUnStakedValue = undelegatedAmounts.reduce(
    (a, b) => new BigNumber(a).plus(b),
    new BigNumber(ZERO)
  );

  return (
    <div className='delegation-row d-flex flex-wrap align-items-center justify-content-between p-3 px-md-4'>
      <ProviderDetails provider={provider} />

      {userActiveStake !== ZERO && (
        <DetailsBlock>
          <strong>
            <FormatAmount value={userActiveStake} />
          </strong>
          <small>Amount Staked</small>
        </DetailsBlock>
      )}

      {bNtotalUserUnStakedValue.isGreaterThan(ZERO) && (
        <DetailsBlock>
          <strong>
            <FormatAmount value={bNtotalUserUnStakedValue.toString(10)} />
          </strong>
          <small>Undelegated</small>
        </DetailsBlock>
      )}

      <DetailsBlock>
        <strong>
          {claimableRewards ? (
            <FormatAmount value={claimableRewards} />
          ) : (
            <>0 {egldLabel}</>
          )}
        </strong>
        <small>Rewards</small>
      </DetailsBlock>
    </div>
  );
};
