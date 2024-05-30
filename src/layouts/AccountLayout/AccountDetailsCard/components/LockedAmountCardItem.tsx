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
    stakingDataReady,
    totalStaked,
    totalLegacyDelegation,
    totalLocked,
    totalClaimable,
    totalActiveStake,
    totalUnstakedValue
  } = useSelector(accountStakingSelector);
  const { account } = useSelector(accountSelector);

  const bNtotalStaked = new BigNumber(totalStaked);
  const bNtotalActiveStake = new BigNumber(totalActiveStake);
  const bNtotalLegacyDelegation = new BigNumber(totalLegacyDelegation);
  const bNtotalLocked = new BigNumber(totalLocked);
  const bNtotalClaimable = new BigNumber(totalClaimable);
  const bNUnstaked = new BigNumber(totalUnstakedValue);

  const lockedDetails = [
    {
      label: 'Stake',
      value: <FormatAmount value={bNtotalStaked.toString(10)} />
    },
    {
      label: 'Delegation',
      value: <FormatAmount value={bNtotalActiveStake.toString(10)} />
    },
    {
      label: 'Legacy Delegation',
      value: <FormatAmount value={bNtotalLegacyDelegation.toString(10)} />
    },
    {
      label: 'Claimable Rewards',
      value: <FormatAmount value={bNtotalClaimable.toString(10)} />
    }
  ];

  if (bNUnstaked.isGreaterThan(0)) {
    lockedDetails.push({
      label: 'Unstaked',
      value: <FormatAmount value={bNUnstaked.toString(10)} />
    });
  }

  const isDataReady =
    stakingDataReady && account.address && account.address === lockedAddress;

  return (
    <CardItem className={classNames(cardItemClass)} title='Stake' icon={faLock}>
      <div className='d-flex align-items-center'>
        {isDataReady ? (
          <FormatAmount value={bNtotalLocked.toString(10)} />
        ) : (
          ELLIPSIS
        )}
        {isDataReady && <LockedAmountTooltip lockedDetails={lockedDetails} />}
      </div>
    </CardItem>
  );
};
