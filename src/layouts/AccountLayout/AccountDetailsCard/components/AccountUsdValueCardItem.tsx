import BigNumber from 'bignumber.js';
import classNames from 'classnames';
import { useSelector } from 'react-redux';

import { ELLIPSIS } from 'appConstants';
import { CardItem, LockedAmountTooltip, FormatUSD } from 'components';
import { DECIMALS } from 'config';
import { formatAmount } from 'helpers';
import { faDollarSign } from 'icons/solid';
import {
  accountSelector,
  accountStakingSelector,
  accountExtraSelector,
  economicsSelector
} from 'redux/selectors';

export const AccountUsdValueCardItem = ({
  cardItemClass
}: {
  cardItemClass?: string;
}) => {
  const { account } = useSelector(accountSelector);
  const { isFetched: isEconomicsFetched, unprocessed } =
    useSelector(economicsSelector);
  const { accountExtra, isFetched: isAccountExtraFetched } =
    useSelector(accountExtraSelector);
  const {
    accountStakingFetched,
    totalLocked,
    address: lockedAddress
  } = useSelector(accountStakingSelector);

  const { address, balance } = account;
  const { tokenBalance, address: extraAddress } = accountExtra;

  let totalWorth = balance ? new BigNumber(balance) : new BigNumber(0);
  if (accountStakingFetched) {
    totalWorth = totalWorth.plus(totalLocked);
  }
  const formattedTotalWorth = formatAmount({
    input: totalWorth.toString(10),
    digits: 2,
    showLastNonZeroDecimal: true
  });

  let totalUsdValue = new BigNumber(formattedTotalWorth).times(
    isEconomicsFetched ? new BigNumber(unprocessed.price) : 1
  );
  if (tokenBalance) {
    totalUsdValue = totalUsdValue.plus(new BigNumber(tokenBalance));
  }

  const isCorrectData =
    address && address === lockedAddress && address === extraAddress;

  const isDataReady =
    isAccountExtraFetched &&
    accountStakingFetched &&
    isEconomicsFetched &&
    isCorrectData;

  if (!isEconomicsFetched) {
    return null;
  }

  return (
    <CardItem
      className={classNames(cardItemClass)}
      title='Value'
      icon={faDollarSign}
    >
      <div className='d-flex align-items-center'>
        {(balance || tokenBalance) && isDataReady ? (
          <FormatUSD
            value={totalUsdValue.toString()}
            usd={1}
            showPrefix={false}
            className='text-truncate'
          />
        ) : (
          ELLIPSIS
        )}
        {isDataReady && (
          <LockedAmountTooltip
            lockedDetails={[
              {
                label: 'Available Balance',
                value: (
                  <FormatUSD
                    value={new BigNumber(balance ?? 0).toString(10)}
                    showPrefix={false}
                    decimals={DECIMALS}
                  />
                )
              },
              {
                label: 'Stake (Locked)',
                value: (
                  <FormatUSD
                    value={new BigNumber(totalLocked ?? 0).toString(10)}
                    showPrefix={false}
                    decimals={DECIMALS}
                  />
                )
              },
              {
                label: 'Token Balance',
                value: (
                  <FormatUSD
                    value={new BigNumber(tokenBalance ?? 0).toString()}
                    usd={1}
                    showPrefix={false}
                  />
                )
              }
            ]}
          />
        )}
      </div>
    </CardItem>
  );
};
