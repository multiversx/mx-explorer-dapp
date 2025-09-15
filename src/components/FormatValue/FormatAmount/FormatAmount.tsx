import BigNumber from 'bignumber.js';
import classNames from 'classnames';
import { useSelector } from 'react-redux';

import {
  ELLIPSIS,
  NATIVE_TOKEN_IDENTIFIER,
  NATIVE_TOKEN_SEARCH_LABEL
} from 'appConstants';
import { NativeTokenSymbol } from 'components';
import { DECIMALS, DIGITS } from 'config';
import { formatAmount, isEgldToken } from 'helpers';
import { stringIsInteger } from 'lib';
import { activeNetworkSelector, economicsSelector } from 'redux/selectors';

import { WithClassnameType } from 'types';

import { FormatDisplayValue } from '../FormatDisplayValue';
import { FormatUSD } from '../FormatUSD';

export interface FormatAmountUIType extends WithClassnameType {
  value: string;
  showLastNonZeroDecimal?: boolean;
  showLabel?: boolean;
  token?: string;
  digits?: number;
  decimals?: number;
  egldLabel?: string;
  'data-testid'?: string;

  showTooltip?: boolean;
  showSymbol?: boolean;
  superSuffix?: boolean;
  showUsdValue?: boolean;
  decimalOpacity?: boolean;
  usd?: string | number;
}

export const FormatAmount = (props: FormatAmountUIType) => {
  const { egldLabel: networkEgldLabel } = useSelector(activeNetworkSelector);
  const { isFetched, unprocessed } = useSelector(economicsSelector);
  const {
    egldLabel,
    value,
    className,
    token,
    digits = DIGITS,
    decimals = DECIMALS,
    showLastNonZeroDecimal = false,
    showSymbol = true,
    showUsdValue = true,
    showLabel,
    showTooltip = true,
    usd
  } = props;
  const label = egldLabel ?? networkEgldLabel;
  const displayLabel =
    label === NATIVE_TOKEN_IDENTIFIER ? NATIVE_TOKEN_SEARCH_LABEL : label;
  const dataTestId = props['data-testid'] ?? 'formatAmountComponent';
  const isCustomIcon = !isEgldToken(networkEgldLabel);

  if (!stringIsInteger(value)) {
    return (
      <span
        data-testid={dataTestId}
        className={classNames(className, 'fam invalid')}
      >
        {ELLIPSIS}
      </span>
    );
  }

  const isZero = new BigNumber(value).isZero();
  const formattedValue = formatAmount({
    input: value,
    decimals,
    digits,
    showLastNonZeroDecimal,
    addCommas: true
  });

  const completeValue = digits
    ? formatAmount({
        input: value,
        decimals,
        digits,
        showLastNonZeroDecimal: true,
        addCommas: true
      })
    : formattedValue;

  const showUsdValueTooltip =
    showTooltip &&
    showUsdValue &&
    !isZero &&
    (showSymbol || showLabel) &&
    ((isFetched && unprocessed.price) || (usd && !token));

  return (
    <FormatDisplayValue
      {...props}
      formattedValue={formattedValue}
      completeValue={completeValue}
      label={displayLabel}
      data-testid={dataTestId}
      showSymbol={showSymbol}
      showLastNonZeroDecimal={showLastNonZeroDecimal}
      showTooltipLabel
      spacedLabel
      {...(showSymbol && !token
        ? {
            symbol: (
              <>
                <NativeTokenSymbol
                  className={classNames('sym', { custom: isCustomIcon })}
                />{' '}
              </>
            )
          }
        : {})}
      {...(showUsdValueTooltip
        ? {
            details: (
              <>
                {usd ? '' : 'Current '}
                USD Value:{' '}
                <FormatUSD
                  usd={usd}
                  value={value}
                  decimals={decimals}
                  digits={digits}
                  showTooltip={false}
                  showPrefix={false}
                />
              </>
            )
          }
        : {})}
    />
  );
};
