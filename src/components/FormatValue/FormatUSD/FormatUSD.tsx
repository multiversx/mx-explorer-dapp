import BigNumber from 'bignumber.js';
import classNames from 'classnames';
import { useSelector } from 'react-redux';

import { ELLIPSIS } from 'appConstants';
import { Overlay } from 'components';
import { DIGITS } from 'config';
import { formatAmount, formatUSD, stringIsFloat, FormatUSDType } from 'helpers';

import { economicsSelector } from 'redux/selectors';
import { WithClassnameType } from 'types';

export interface FormatUSDUIType extends FormatUSDType, WithClassnameType {
  decimals?: number;
  showTooltip?: boolean;
}

export const FormatUSD = ({
  amount: unprocessedAmount,
  usd: usdValue,
  digits,
  decimals,
  maxDigits,
  showPrefix = true,
  showTooltip = true,
  showLastNonZeroDecimal,
  className
}: FormatUSDUIType) => {
  const { isFetched, unprocessed } = useSelector(economicsSelector);

  const displayDigits = digits ? digits : DIGITS;
  const amount = decimals
    ? formatAmount({
        input: String(unprocessedAmount),
        denomination: decimals,
        decimals: DIGITS,
        showLastNonZeroDecimal: true,
        addCommas: false
      })
    : unprocessedAmount;
  const formattedAmount = new BigNumber(amount).toFormat({
    groupSeparator: '',
    decimalSeparator: '.'
  });

  const usd =
    usdValue ?? (isFetched && unprocessed.price ? unprocessed.price : 1);

  const value = new BigNumber(amount).times(new BigNumber(usd));
  const isEqual = new BigNumber(value).isEqualTo(
    BigNumber(value).toFixed(displayDigits)
  );

  return (
    <span className={classNames('d-inline-flex', className)}>
      {!stringIsFloat(formattedAmount) || (!usdValue && !isFetched) ? (
        ELLIPSIS
      ) : (
        <>
          {showTooltip && !isEqual ? (
            <Overlay title={`$${value.toFormat()}`} className='cursor-context'>
              {formatUSD({
                amount,
                usd,
                digits,
                maxDigits,
                showPrefix,
                showLastNonZeroDecimal
              })}
            </Overlay>
          ) : (
            formatUSD({
              amount,
              usd,
              digits,
              maxDigits,
              showPrefix,
              showLastNonZeroDecimal
            })
          )}
        </>
      )}
    </span>
  );
};