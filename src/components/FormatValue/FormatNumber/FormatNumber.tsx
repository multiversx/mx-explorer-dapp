import BigNumber from 'bignumber.js';
import classNames from 'classnames';

import { ELLIPSIS } from 'appConstants';
import { FormatAmountUIType } from 'components';
import { formatBigNumber } from 'helpers';

import { FormatDisplayValue } from '../FormatDisplayValue';

export interface FormatNumberUIType extends Omit<FormatAmountUIType, 'value'> {
  value: string | number | BigNumber;
  label?: string;
  symbol?: React.ReactNode;
}

export const FormatNumber = (props: FormatNumberUIType) => {
  const { value, symbol, label, className } = props;
  const bNamount = BigNumber.isBigNumber(value) ? value : new BigNumber(value);
  const completeValue = bNamount.toFormat();

  if (bNamount.isNaN()) {
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

  const formattedValue = bNamount.isInteger()
    ? completeValue
    : formatBigNumber({ value: bNamount });

  return (
    <FormatDisplayValue
      {...props}
      formattedValue={formattedValue}
      completeValue={completeValue}
      symbol={symbol}
      egldLabel={label}
      showSymbol={Boolean(symbol)}
      showLabel={Boolean(label)}
      showTooltipSymbol={Boolean(symbol)}
      showTooltipLabel={Boolean(label)}
    />
  );
};
