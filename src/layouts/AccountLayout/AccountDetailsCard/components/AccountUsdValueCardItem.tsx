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
  const { isFetched: isEconomicsFetched, unprocessed } =
    useSelector(economicsSelector);
  const { account } = useSelector(accountSelector);
  const { accountExtra, isFetched: isAccountExtraFetched } =
    useSelector(accountExtraSelector);
  const { balance } = account;
  const { tokenBalance } = accountExtra;
  const { stakingDataReady, totalLocked } = useSelector(accountStakingSelector);

  let totalWorth = balance ? new BigNumber(balance) : new BigNumber(0);
  if (stakingDataReady) {
    totalWorth = totalWorth.plus(new BigNumber(totalLocked));
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

  const isDataReady =
    isAccountExtraFetched && stakingDataReady && isEconomicsFetched;

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
                label: 'Stake',
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
