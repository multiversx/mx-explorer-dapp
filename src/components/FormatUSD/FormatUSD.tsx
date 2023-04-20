import React from 'react';
import BigNumber from 'bignumber.js';
import { useSelector } from 'react-redux';

import { ELLIPSIS } from 'appConstants';
import { Overlay } from 'components';
import { denominate } from 'components/Denominate/denominate';
import { DIGITS } from 'config';
import { formatUSD } from 'helpers';
import { stringIsFloat } from 'helpers';

import { economicsSelector } from 'redux/selectors';

export const FormatUSD = ({
  amount: unprocessedAmount,
  usd: usdValue,
  digits,
  decimals,
  showTooltip = true
}: {
  amount: string | number;
  usd?: string | number;
  decimals?: number;
  digits?: number;
  showTooltip?: boolean;
}) => {
  const { isFetched, unprocessed } = useSelector(economicsSelector);

  const displayDigits = digits ? digits : DIGITS;
  const amount = decimals
    ? denominate({
        input: String(unprocessedAmount),
        denomination: decimals,
        decimals: DIGITS,
        showLastNonZeroDecimal: true,
        addCommas: false
      })
    : unprocessedAmount;

  const usd =
    usdValue ?? (isFetched && unprocessed.price ? unprocessed.price : 1);

  const value = new BigNumber(amount).times(new BigNumber(usd));
  const isEqual = new BigNumber(value).isEqualTo(
    BigNumber(value).toFixed(displayDigits)
  );

  return (
    <span className='d-inline-flex'>
      {!stringIsFloat(String(amount)) || !isFetched ? (
        ELLIPSIS
      ) : (
        <>
          {showTooltip && !isEqual ? (
            <Overlay title={`$${value.toFormat()}`}>
              {formatUSD({ amount, usd, digits, showPrefix: false })}
            </Overlay>
          ) : (
            formatUSD({ amount, usd, digits, showPrefix: false })
          )}
        </>
      )}
    </span>
  );
};
