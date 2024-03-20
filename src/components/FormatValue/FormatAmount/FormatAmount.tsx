import { useState, useRef } from 'react';
import { stringIsInteger } from '@multiversx/sdk-dapp/utils/validation/stringIsInteger';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useSelector } from 'react-redux';

import { MAX_DISPLAY_ZERO_DECIMALS } from 'appConstants';
import { ReactComponent as MultiversXSymbol } from 'assets/img/symbol.svg';
import { DECIMALS, DIGITS } from 'config';
import { formatAmount } from 'helpers';
import { activeNetworkSelector } from 'redux/selectors';

// TODO - will change into FormatAmount similar to sdk-dapp in a different PR

export interface FormatAmountType {
  value: string;
  showLastNonZeroDecimal?: boolean;
  showLabel?: boolean;
  token?: string | React.ReactNode;
  decimals?: number;
  denomination?: number;
  showTooltip?: boolean;
  showSymbol?: boolean;
  superSuffix?: boolean;
  'data-testid'?: string;
}

const CompleteValueTooltip = ({
  completeValue,
  children
}: {
  completeValue: string;
  children: React.ReactNode;
}) => {
  const [show, setShow] = useState(false);
  const handleOnMouseEnter = () => {
    setShow(true);
  };
  const handleOnMouseLeave = () => {
    setShow(false);
  };
  const ref = useRef(null);

  return (
    <OverlayTrigger
      placement='top'
      show={show}
      delay={{ show: 0, hide: 400 }}
      overlay={
        <Tooltip
          onMouseEnter={handleOnMouseEnter}
          onMouseLeave={handleOnMouseLeave}
        >
          {completeValue}
        </Tooltip>
      }
    >
      <span
        ref={ref}
        onMouseEnter={handleOnMouseEnter}
        onMouseLeave={handleOnMouseLeave}
      >
        {children}
      </span>
    </OverlayTrigger>
  );
};

const formatAmountInvalid = (props: FormatAmountType) => {
  return (
    <span
      data-testid={
        props['data-testid'] ? props['data-testid'] : 'formatAmountComponent'
      }
    >
      <span className='int-amount'>...</span>
    </span>
  );
};

const formatAmountValid = (props: FormatAmountType, egldLabel?: string) => {
  const {
    value,
    showLastNonZeroDecimal = false,
    showLabel = true,
    showTooltip = true,
    showSymbol = true,
    superSuffix = false
  } = props;
  const decimals = props.decimals !== undefined ? props.decimals : DIGITS;
  const denomination =
    props.denomination !== undefined ? props.denomination : DECIMALS;

  const formattedValue = formatAmount({
    input: value,
    denomination,
    decimals,
    showLastNonZeroDecimal
  });

  const completeValue = formatAmount({
    input: value,
    denomination,
    decimals,
    showLastNonZeroDecimal: true
  });

  const valueParts = formattedValue.split('.');
  const hasNoDecimals = valueParts.length === 1;
  const isNotZero = formattedValue !== '0';

  if (decimals > 0 && hasNoDecimals && isNotZero) {
    let zeros = '';

    for (let i = 1; i <= decimals; i++) {
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
        if (nonZeroDecimals.length < Math.max(decimals, 2)) {
          nonZeroDecimals.push(decimalArray[i]);
        }
      }

      if (firstNonZeroIndex > MAX_DISPLAY_ZERO_DECIMALS) {
        return (
          <>
            <span className='amount'>0</span>
            <span className='decimals'>.0...0{nonZeroDecimals.join('')}</span>
          </>
        );
      }
    }

    return (
      <>
        <span className='amount'>{valueParts[0]}</span>
        {valueParts.length > 1 && (
          <span className='decimals'>.{valueParts[1]}</span>
        )}
      </>
    );
  };

  return (
    <span
      data-testid={
        props['data-testid'] ? props['data-testid'] : 'formatAmountComponent'
      }
      className='formatAmount'
    >
      {showSymbol && !props.token && (
        <>
          <MultiversXSymbol className='symbol' />{' '}
        </>
      )}
      {showTooltip && completeValue !== formattedValue ? (
        <CompleteValueTooltip completeValue={completeValue}>
          <DisplayValue />
        </CompleteValueTooltip>
      ) : (
        <DisplayValue />
      )}

      {showLabel && (
        <>
          {superSuffix ? (
            <sup className='suffix'>
              &nbsp;{props.token ? props.token : egldLabel}
            </sup>
          ) : (
            <span className='suffix'>
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