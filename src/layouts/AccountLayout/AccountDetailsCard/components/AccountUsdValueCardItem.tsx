import BigNumber from 'bignumber.js';
import { useSelector } from 'react-redux';

import { CardItem, LockedAmountTooltip, FormatUSD } from 'components';
import { DECIMALS } from 'config';
import { denominate } from 'helpers';
import { faDollarSign } from 'icons/solid';
import {
  accountSelector,
  accountStakingSelector,
  economicsSelector
} from 'redux/selectors';

export const AccountUsdValueCardItem = ({
  cardItemClass
}: {
  cardItemClass: string;
}) => {
  const { isFetched: isEconomicsFetched, unprocessed } =
    useSelector(economicsSelector);
  const { account } = useSelector(accountSelector);
  const { balance, tokenBalance } = account;
  const { stakingDataReady, totalLocked } = useSelector(accountStakingSelector);

  let totalWorth = balance ? new BigNumber(balance) : new BigNumber(0);
  if (stakingDataReady) {
    totalWorth = totalWorth.plus(new BigNumber(totalLocked));
  }
  const denominatedTotalWorth = denominate({
    input: totalWorth.toString(10),
    denomination: DECIMALS,
    decimals: 2,
    showLastNonZeroDecimal: true,
    addCommas: false
  });

  let totalUsdValue = new BigNumber(denominatedTotalWorth).times(
    isEconomicsFetched ? new BigNumber(unprocessed.price) : 1
  );
  if (tokenBalance) {
    totalUsdValue = totalUsdValue.plus(new BigNumber(tokenBalance));
  }

  return (
    <CardItem className={cardItemClass} title='Value' icon={faDollarSign}>
      <div className='d-flex align-items-center text-truncate gap-2'>
        {(balance || tokenBalance) && stakingDataReady && isEconomicsFetched ? (
          <span className='text-truncate'>
            <FormatUSD
              amount={totalUsdValue.toString()}
              usd={1}
              digits={2}
              showPrefix={false}
            />
          </span>
        ) : (
          <>...</>
        )}
        {stakingDataReady && isEconomicsFetched && (
          <LockedAmountTooltip
            lockedDetails={[
              {
                label: 'Available Balance',
                value: (
                  <FormatUSD
                    amount={new BigNumber(balance ?? 0).toString(10)}
                    decimals={DECIMALS}
                    digits={2}
                    showPrefix={false}
                  />
                )
              },
              {
                label: 'Stake',
                value: (
                  <FormatUSD
                    amount={new BigNumber(totalLocked ?? 0).toString(10)}
                    decimals={DECIMALS}
                    digits={2}
                    showPrefix={false}
                  />
                )
              },
              {
                label: 'Token Balance',
                value: (
                  <FormatUSD
                    amount={new BigNumber(tokenBalance ?? 0).toString()}
                    usd={1}
                    digits={2}
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
