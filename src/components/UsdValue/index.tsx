import React from 'react';
import { denominate } from 'components/Denominate/denominate';
import { denomination, decimals } from 'appConfig';
import { stringIsInteger, usdValue } from 'helpers';
import { useGlobalState } from 'context';

export const UsdValue = ({
  input,
  className = '',
  dataTestId = '',
  showPrefix = false,
}: {
  input: string;
  className?: string;
  dataTestId?: string;
  showPrefix?: boolean;
}) => {
  const { usd } = useGlobalState();
  return (
    <span className={className} data-testid={dataTestId}>
      {!stringIsInteger(input) || !usd
        ? '...'
        : usdValue({
            amount: denominate({
              input,
              denomination,
              decimals,
              showLastNonZeroDecimal: true,
              addCommas: false,
            }),
            usd,
            showPrefix,
          })}
    </span>
  );
};