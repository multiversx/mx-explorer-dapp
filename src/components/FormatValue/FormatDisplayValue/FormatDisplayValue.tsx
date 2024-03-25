import classNames from 'classnames';

import { MAX_DISPLAY_ZERO_DECIMALS, ZERO } from 'appConstants';
import { FormatAmountUIType, Overlay } from 'components';
import { DIGITS } from 'config';

export interface FormatDisplayValueUIType
  extends Omit<FormatAmountUIType, 'value'> {
  formattedValue: string | number;
  completeValue: string | number;
  symbol?: React.ReactNode;
}

export const FormatDisplayValue = (props: FormatDisplayValueUIType) => {
  const {
    formattedValue,
    completeValue,
    token,
    symbol,
    egldLabel,
    digits = DIGITS,
    showLastNonZeroDecimal = false,
    showLabel = true,
    showTooltip = true,
    showSymbol = false,
    superSuffix = false,
    className
  } = props;

  const valueParts = String(formattedValue).split('.');
  const hasNoDecimals = valueParts.length === 1;
  const isFormattedValueZero = Number(formattedValue) === 0;
  const isZero = Number(completeValue) === 0;

  if (digits > 0 && hasNoDecimals && !isFormattedValueZero) {
    let zeros = '';

    for (let i = 1; i <= digits; i++) {
      zeros = zeros + ZERO;
    }

    valueParts.push(zeros);
  }

  const DisplayValue = () => {
    if (
      !showLastNonZeroDecimal &&
      isFormattedValueZero &&
      formattedValue !== completeValue
    ) {
      const valueParts = String(completeValue).split('.');
      const decimalArray = valueParts?.[1]?.split('') ?? [];
      const firstNonZeroIndex = decimalArray.findIndex(
        (digit) => digit !== ZERO
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
        {valueParts[1] && <span className='dec'>.{valueParts[1]}</span>}
      </>
    );
  };

  return (
    <span
      className={classNames(className, 'fam')}
      {...(props['data-testid'] ? { 'data-testid': props['data-testid'] } : {})}
    >
      {showSymbol && symbol && <>{symbol}</>}
      {showTooltip && completeValue !== formattedValue && !isZero ? (
        <Overlay title={completeValue} persistent>
          <DisplayValue />
        </Overlay>
      ) : (
        <DisplayValue />
      )}
      {showLabel && (
        <>
          {superSuffix ? (
            <sup className='suf'>{token ? token : egldLabel}</sup>
          ) : (
            <span className='suf'>&nbsp;{token ? token : egldLabel}</span>
          )}
        </>
      )}
    </span>
  );
};
