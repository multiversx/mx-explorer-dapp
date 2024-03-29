import BigNumber from 'bignumber.js';
import classNames from 'classnames';
import { useSelector } from 'react-redux';

import { ELLIPSIS } from 'appConstants';
import { ReactComponent as MultiversXSymbol } from 'assets/img/symbol.svg';
import { FormatAmountUIType, FormatUSD } from 'components';
import { DIGITS } from 'config';
import { formatBigNumber, stringIsFloat } from 'helpers';
import { activeNetworkSelector, economicsSelector } from 'redux/selectors';

import { FormatDisplayValue } from '../FormatDisplayValue';

export interface FormatEGLDUIType extends Omit<FormatAmountUIType, 'value'> {
  value: string | number;
  showUsdValue?: boolean;
  usd?: string | number;
}

export const FormatEGLD = (props: FormatEGLDUIType) => {
  const { egldLabel = '' } = useSelector(activeNetworkSelector);
  const { isFetched, unprocessed } = useSelector(economicsSelector);
  const {
    value,
    usd,
    digits = DIGITS,
    showSymbol,
    showUsdValue = true,
    className
  } = props;
  const numberValue = String(value).replace(/[^\d.-]/g, '');

  if (!stringIsFloat(numberValue)) {
    <span
      className={classNames(className, 'fam invalid')}
      {...(props['data-testid'] ? { 'data-testid': props['data-testid'] } : {})}
    >
      {ELLIPSIS}
    </span>;
  }

  const bNValue = new BigNumber(numberValue);
  const completeValue = bNValue.toFormat();
  const formattedValue = bNValue.isInteger()
    ? completeValue
    : formatBigNumber({ value: bNValue, digits });

  const showUsdValueTooltip =
    !bNValue.isZero() &&
    showUsdValue &&
    ((isFetched && unprocessed.price) || usd);

  return (
    <FormatDisplayValue
      {...props}
      formattedValue={formattedValue}
      completeValue={completeValue}
      egldLabel={egldLabel}
      showTooltipLabel
      {...(showSymbol && !props.token
        ? {
            symbol: (
              <>
                <MultiversXSymbol className='sym' />{' '}
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
                  value={numberValue}
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
