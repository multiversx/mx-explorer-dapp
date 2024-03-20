import { stringIsInteger } from '@multiversx/sdk-dapp/utils/validation/stringIsInteger';
import { useSelector } from 'react-redux';

import { MAX_DISPLAY_ZERO_DECIMALS } from 'appConstants';
import { ReactComponent as MultiversXSymbol } from 'assets/img/symbol.svg';
import { Overlay } from 'components';
import { DECIMALS, DIGITS } from 'config';
import { formatAmount } from 'helpers';
import { activeNetworkSelector } from 'redux/selectors';

// TODO - will change into FormatAmount similar to sdk-dapp in a different PR

export interface FormatAmountType {
  value: string;
  showLastNonZeroDecimal?: boolean;
  showLabel?: boolean;
  token?: string | React.ReactNode;
  digits?: number;
  decimals?: number;
  showTooltip?: boolean;
  showSymbol?: boolean;
  superSuffix?: boolean;
  'data-testid'?: string;
}

const formatAmountInvalid = (props: FormatAmountType) => {
  return (
    <span
      data-testid={
        props['data-testid'] ? props['data-testid'] : 'formatAmountComponent'
      }
    >
      <span className='inv-am'>...</span>
    </span>
  );
};

const formatAmountValid = (props: FormatAmountType, egldLabel?: string) => {
  const {
    value,
    digits = DIGITS,
    decimals = DECIMALS,
    showLastNonZeroDecimal = false,
    showLabel = true,
    showTooltip = true,
    showSymbol = true,
    superSuffix = false
  } = props;

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

  const valueParts = formattedValue.split('.');
  const hasNoDecimals = valueParts.length === 1;
  const isNotZero = formattedValue !== '0';

  if (digits > 0 && hasNoDecimals && isNotZero) {
    let zeros = '';

    for (let i = 1; i <= digits; i++) {
      zeros = zeros + '0';
    }

    valueParts.push(zeros);
  }

  const DisplayValue = () => {
    if (
      !showLastNonZeroDecimal &&
      formattedValue === '0' &&
      formattedValue !== completeValue
    ) {
      const valueParts = completeValue.split('.');
      const decimalArray = valueParts[1].split('');
      const firstNonZeroIndex = decimalArray.findIndex(
        (digit) => digit !== '0'
      );
      const nonZeroDecimals = [];
      for (let i = firstNonZeroIndex; i <= decimalArray.length - 1; i++) {
        if (nonZeroDecimals.length < Math.max(digits, 2)) {
          nonZeroDecimals.push(decimalArray[i]);
        }
      }

      if (firstNonZeroIndex > MAX_DISPLAY_ZERO_DECIMALS) {
        return (
          <>
            <span className='am'>0</span>
            <span className='dec'>.0...0{nonZeroDecimals.join('')}</span>
          </>
        );
      }
    }

    return (
      <>
        <span className='am'>{valueParts[0]}</span>
        {valueParts.length > 1 && <span className='dec'>.{valueParts[1]}</span>}
      </>
    );
  };

  return (
    <span
      data-testid={
        props['data-testid'] ? props['data-testid'] : 'formatAmountComponent'
      }
      className='fam'
    >
      {showSymbol && !props.token && (
        <>
          <MultiversXSymbol className='sym' />{' '}
        </>
      )}
      {showTooltip && completeValue !== formattedValue ? (
        <Overlay title={completeValue} className='cursor-context' persistent>
          <DisplayValue />
        </Overlay>
      ) : (
        <DisplayValue />
      )}
      {showLabel && (
        <>
          {superSuffix ? (
            <sup className='suf'>
              &nbsp;{props.token ? props.token : egldLabel}
            </sup>
          ) : (
            <span className='suf'>
              &nbsp;{props.token ? props.token : egldLabel}
            </span>
          )}
        </>
      )}
    </span>
  );
};

export const FormatAmount = (props: FormatAmountType) => {
  const { egldLabel } = useSelector(activeNetworkSelector);
  const { value } = props;

  return !stringIsInteger(value)
    ? formatAmountInvalid(props)
    : formatAmountValid(props, egldLabel);
};
