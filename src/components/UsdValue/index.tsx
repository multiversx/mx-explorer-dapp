import React from 'react';
import { useSelector } from 'react-redux';
import { denominate } from 'components/Denominate/denominate';
import { DECIMALS, DIGITS } from 'config';
import { stringIsInteger, usdValue } from 'helpers';

import { economicsSelector } from 'redux/selectors';

export const UsdValue = ({
  input,
  className = '',
  dataTestId = '',
  showPrefix = false
}: {
  input: string;
  className?: string;
  dataTestId?: string;
  showPrefix?: boolean;
}) => {
  const { economicsFetched, price } = useSelector(economicsSelector);
  return (
    <span className={className} data-testid={dataTestId}>
      {!stringIsInteger(input) || !economicsFetched
        ? '...'
        : usdValue({
            amount: denominate({
              input,
              denomination: DECIMALS,
              decimals: DIGITS,
              showLastNonZeroDecimal: true,
              addCommas: false
            }),
            usd: price,
            showPrefix
          })}
    </span>
  );
};
