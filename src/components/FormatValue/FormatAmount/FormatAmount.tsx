import { FormatAmountPropsType as SdkDappFormatAmountType } from '@multiversx/sdk-dapp/UI/FormatAmount/formatAmount.types';
import { stringIsInteger } from '@multiversx/sdk-dapp/utils/validation/stringIsInteger';
import classNames from 'classnames';
import { useSelector } from 'react-redux';

import { ELLIPSIS } from 'appConstants';
import { ReactComponent as MultiversXSymbol } from 'assets/img/symbol.svg';
import { DECIMALS, DIGITS } from 'config';
import { formatAmount } from 'helpers';
import { activeNetworkSelector } from 'redux/selectors';
import { FormatDisplayValue } from '../FormatDisplayValue';

export interface FormatAmountUIType extends SdkDappFormatAmountType {
  showTooltip?: boolean;
  showSymbol?: boolean;
  superSuffix?: boolean;
}

export const FormatAmount = (props: FormatAmountUIType) => {
  const { egldLabel } = useSelector(activeNetworkSelector);
  const {
    value,
    className,
    digits = DIGITS,
    decimals = DECIMALS,
    showLastNonZeroDecimal = false,
    showSymbol = true
  } = props;
  const dataTestId = props['data-testid'] ?? 'formatAmountComponent';

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

  const formattedValue = formatAmount({
    input: value,
    decimals,
    digits,
    showLastNonZeroDecimal,
    addCommas: true
  });

  const completeValue = formatAmount({
    input: value,
    decimals,
    digits,
    showLastNonZeroDecimal: true,
    addCommas: true
  });

  return (
    <FormatDisplayValue
      {...props}
      formattedValue={formattedValue}
      completeValue={completeValue}
      egldLabel={egldLabel}
      data-testid={dataTestId}
      {...(showSymbol && !props.token
        ? {
            symbol: (
              <>
                <MultiversXSymbol className='sym' />{' '}
              </>
            )
          }
        : {})}
    />
  );
};
