import BigNumber from 'bignumber.js';
import classNames from 'classnames';
import { useSelector } from 'react-redux';

import { ELLIPSIS } from 'appConstants';
import { FormatAmountUIType } from 'components';
import { DIGITS } from 'config';
import { formatAmount, stringIsFloat } from 'helpers';
import { economicsSelector } from 'redux/selectors';
import { FormatDisplayValue } from '../FormatDisplayValue';

export interface FormatUSDUIType extends Omit<FormatAmountUIType, 'value'> {
  value: string | number;
  usd?: string | number;
  showPrefix?: boolean;
}

export const FormatUSD = (props: FormatUSDUIType) => {
  const { isFetched, unprocessed } = useSelector(economicsSelector);
  const {
    value: unprocessedValue,
    usd: usdValue,
    digits = DIGITS,
    decimals,
    showSymbol = true,
    showPrefix = true,
    className
  } = props;

  const amount = decimals
    ? formatAmount({
        input: String(unprocessedValue),
        decimals,
        showLastNonZeroDecimal: true
      })
    : unprocessedValue;

  const formattedAmount = new BigNumber(amount).toFormat({
    groupSeparator: '',
    decimalSeparator: '.'
  });

  if (!stringIsFloat(formattedAmount) || (!usdValue && !isFetched)) {
    return (
      <span
        {...(props['data-testid']
          ? { 'data-testid': props['data-testid'] }
          : {})}
        className={classNames(className, 'fam invalid')}
      >
        {ELLIPSIS}
      </span>
    );
  }

  const usd =
    usdValue ?? (isFetched && unprocessed.price ? unprocessed.price : 1);
  const value = new BigNumber(amount).times(new BigNumber(usd));

  const formattedValue = value.toFormat(digits);
  const completeValue = value.toFormat();

  return (
    <FormatDisplayValue
      {...props}
      formattedValue={formattedValue}
      completeValue={completeValue}
      showSymbol={showSymbol}
      symbol={<>{showPrefix ? (value.isGreaterThan(0) ? '≈' : '=') : ''}$</>}
    />
  );
};
