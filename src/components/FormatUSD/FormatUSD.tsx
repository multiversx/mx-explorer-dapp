import BigNumber from 'bignumber.js';
import classNames from 'classnames';
import { useSelector } from 'react-redux';

import { ELLIPSIS } from 'appConstants';
import { Overlay } from 'components';
import { DIGITS } from 'config';
import { denominate, formatUSD, stringIsFloat } from 'helpers';

import { economicsSelector } from 'redux/selectors';
import { WithClassnameType } from 'types';

export interface FormatUSDUIType extends WithClassnameType {
  amount: string | number;
  usd?: string | number;
  decimals?: number;
  digits?: number;
  showPrefix?: boolean;
  showTooltip?: boolean;
}

export const FormatUSD = ({
  amount: unprocessedAmount,
  usd: usdValue,
  digits,
  decimals,
  showPrefix = true,
  showTooltip = true,
  className
}: FormatUSDUIType) => {
  const { isFetched, unprocessed } = useSelector(economicsSelector);

  const displayDigits = digits ? digits : DIGITS;
  const amount = decimals
    ? denominate({
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
            <Overlay title={`$${value.toFormat()}`}>
              {formatUSD({ amount, usd, digits, showPrefix })}
            </Overlay>
          ) : (
            formatUSD({ amount, usd, digits, showPrefix })
          )}
        </>
      )}
    </span>
  );
};
