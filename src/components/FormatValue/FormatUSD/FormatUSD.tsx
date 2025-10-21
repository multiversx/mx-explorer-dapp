import BigNumber from 'bignumber.js';
import classNames from 'classnames';
import { useSelector } from 'react-redux';

import { ELLIPSIS } from 'appConstants';
import { FormatAmountUIType } from 'components';
import { DIGITS } from 'config';
import { formatAmount, stringIsFloat, formatBigNumber } from 'helpers';
import { economicsSelector } from 'redux/selectors';
import { FormatDisplayValue } from '../FormatDisplayValue';

export interface FormatUSDUIType extends Omit<FormatAmountUIType, 'value'> {
  value: string | number;
  usd?: string | number;
  showPrefix?: boolean;
}

export const FormatUSD = (props: FormatUSDUIType) => {
  const { isDataReady, unprocessed } = useSelector(economicsSelector);
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

  if (!stringIsFloat(formattedAmount) || (!usdValue && !isDataReady)) {
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
    usdValue ?? (isDataReady && unprocessed.price ? unprocessed.price : 1);
  const bNValue = new BigNumber(amount).times(new BigNumber(usd));

  const completeValue = bNValue.toFormat();
  const formattedValue = bNValue.isInteger()
    ? completeValue
    : formatBigNumber({ value: bNValue, digits });

  return (
    <FormatDisplayValue
      {...props}
      formattedValue={formattedValue}
      completeValue={completeValue}
      showSymbol={showSymbol}
      showTooltipSymbol
      symbol={<>{showPrefix ? (bNValue.isGreaterThan(0) ? '≈' : '=') : ''}$</>}
    />
  );
};
