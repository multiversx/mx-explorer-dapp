import BigNumber from 'bignumber.js';
import classNames from 'classnames';
import { useSelector } from 'react-redux';

import { ELLIPSIS } from 'appConstants';
import { CardItem, FormatAmount, LockedAmountTooltip } from 'components';
import { faLock } from 'icons/solid';
import { accountStakingSelector, accountSelector } from 'redux/selectors';

export const LockedAmountCardItem = ({
  cardItemClass
}: {
  cardItemClass?: string;
}) => {
  const {
    address: lockedAddress,
    accountStakingFetched,

    activeValidatorStake,
    activeDelegation,
    activeLegacyDelegation,

    totalLocked,
    totalClaimable,
    totalUnstaked
  } = useSelector(accountStakingSelector);
  const { account } = useSelector(accountSelector);
  const hasUnstaked = new BigNumber(totalUnstaked).isGreaterThan(0);

  const lockedDetails = [
    {
      label: 'Stake (Validation)',
      value: <FormatAmount value={activeValidatorStake} />
    },
    {
      label: 'Delegation',
      value: <FormatAmount value={activeDelegation} />
    },
    {
      label: 'Legacy Delegation',
      value: <FormatAmount value={activeLegacyDelegation} />
    },
    {
      label: 'Claimable Rewards',
      value: <FormatAmount value={totalClaimable} />
    }
  ];

  if (hasUnstaked) {
    lockedDetails.push({
      label: 'Unstaked',
      value: <FormatAmount value={totalUnstaked} />
    });
  }

  const isDataReady =
    accountStakingFetched &&
    account.address &&
    account.address === lockedAddress;

  return (
    <CardItem className={classNames(cardItemClass)} title='Stake' icon={faLock}>
      <div className='d-flex align-items-center'>
        {isDataReady ? <FormatAmount value={totalLocked} /> : ELLIPSIS}
        {isDataReady && <LockedAmountTooltip lockedDetails={lockedDetails} />}
      </div>
    </CardItem>
  );
};
