import React from 'react';
import BigNumber from 'bignumber.js';

import { Overlay } from 'components';
import { DIGITS } from 'config';
import { formatUSD } from 'helpers';

export const FormatUSD = ({
  amount,
  usd,
  digits,
  showTooltip = true
}: {
  amount: string | number;
  usd?: string | number;
  digits?: number;
  showTooltip?: boolean;
}) => {
  const displayDigits = digits ? digits : DIGITS;

  const value = new BigNumber(amount).times(usd ? new BigNumber(usd) : 1);
  const isEqual = new BigNumber(value).isEqualTo(
    BigNumber(value).toFixed(displayDigits)
  );

  return (
    <span className='d-inline-flex'>
      {showTooltip && !isEqual ? (
        <Overlay title={`$${value.toFormat()}`}>
          {formatUSD({ amount, usd, digits })}
        </Overlay>
      ) : (
        formatUSD({ amount, usd, digits })
      )}
    </span>
  );
};
