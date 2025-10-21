import NumberFlow from '@number-flow/react';
import classNames from 'classnames';

import { ELLIPSIS, MAX_DISPLAY_ZERO_DECIMALS, ZERO } from 'appConstants';
import { FormatAmountUIType, Overlay } from 'components';
import { DIGITS } from 'config';

export interface FormatDisplayValueUIType
  extends Omit<FormatAmountUIType, 'value'> {
  formattedValue: string | number;
  completeValue: string | number;
  symbol?: React.ReactNode;
  label?: React.ReactNode;
  details?: React.ReactNode;
  hideLessThanOne?: boolean;
  showTooltipSymbol?: boolean;
  showTooltipLabel?: boolean;
  spacedLabel?: boolean;
  isAnimated?: boolean;
}

export const FormatDisplayValue = (props: FormatDisplayValueUIType) => {
  const {
    formattedValue,
    completeValue,
    token,
    symbol,
    label,
    egldLabel,
    details,
    digits = DIGITS,
    showLastNonZeroDecimal,
    hideLessThanOne,
    showLabel = true,
    showTooltip = true,
    showSymbol,
    superSuffix,
    showTooltipSymbol,
    showTooltipLabel,
    spacedLabel,
    decimalOpacity = true,
    isAnimated,
    showEllipsisIfZero,
    className
  } = props;

  const valueParts = String(formattedValue).split('.');
  const isZero = Number(completeValue) === 0;
  const displayLabel = label ?? token ?? egldLabel;
  const canAnimate = isAnimated && !isNaN(Number(completeValue));

  const DisplayValue = () => {
    if (hideLessThanOne) {
      return <span className='am'>{'< 1'}</span>;
    }
    const completeValueParts = String(completeValue).split('.');
    const decimalArray = completeValueParts?.[1]?.split('') ?? [];
    const areAllDigitsZeroes = decimalArray.every((digit) => digit === ZERO);
    if (!showLastNonZeroDecimal) {
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
            <span className='am'>{valueParts[0]}</span>
            <span className={classNames('dec', { opc: decimalOpacity })}>
              .0<sub>{firstNonZeroIndex - 2}</sub>0{nonZeroDecimals.join('')}
            </span>
          </>
        );
      }
    }

    return (
      <>
        <span className='am'>{valueParts[0]}</span>
        {valueParts[1] && !areAllDigitsZeroes && (
          <span className={classNames('dec', { opc: decimalOpacity })}>
            .{valueParts[1]}
          </span>
        )}
      </>
    );
  };

  const showCompleteValue =
    completeValue !== formattedValue &&
    String(completeValue).length > String(formattedValue).length &&
    !isZero;
  const displayTooltip = showTooltip && (details || showCompleteValue);

  if (isZero && showEllipsisIfZero) {
    return <span className={classNames(className, 'fam')}>{ELLIPSIS}</span>;
  }

  return (
    <span
      className={classNames(className, 'fam', { anim: canAnimate })}
      {...(props['data-testid'] ? { 'data-testid': props['data-testid'] } : {})}
    >
      {showSymbol && symbol && <>{symbol}</>}
      {displayTooltip ? (
        <Overlay
          title={
            <>
              {showCompleteValue && (
                <>
                  {showSymbol && showTooltipSymbol && symbol && <>{symbol}</>}
                  {completeValue}
                  {showLabel && showTooltipLabel && displayLabel && (
                    <>
                      {spacedLabel && <>&nbsp;</>}
                      {displayLabel}
                    </>
                  )}
                </>
              )}
              {details ? (
                <>
                  {showCompleteValue && <br />}
                  {details}
                </>
              ) : null}
            </>
          }
          persistent
          truncate
        >
          {canAnimate ? (
            <NumberFlow
              value={Number(completeValue)}
              locales='en-US'
              format={{
                maximumFractionDigits: digits
              }}
            />
          ) : (
            <DisplayValue />
          )}
        </Overlay>
      ) : (
        <>
          {' '}
          {canAnimate ? (
            <NumberFlow
              value={Number(completeValue)}
              locales='en-US'
              format={{
                maximumFractionDigits: digits
              }}
            />
          ) : (
            <DisplayValue />
          )}
        </>
      )}
      {showLabel && displayLabel && !canAnimate && (
        <>
          {superSuffix ? (
            <sup className={classNames('suf', { opc: decimalOpacity })}>
              {displayLabel}
            </sup>
          ) : (
            <span className={classNames('suf', { opc: decimalOpacity })}>
              {spacedLabel && <>&nbsp;</>}
              {displayLabel}
            </span>
          )}
        </>
      )}
    </span>
  );
};
