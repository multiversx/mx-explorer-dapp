import React from 'react';
import denominate from 'sharedComponents/Denominate/denominate';
import { denomination, decimals } from 'appConfig';
import { stringIsInteger, usdValue } from 'helpers';

const UsdValue = ({
  input,
  usd,
  className = '',
  dataTestId = '',
}: {
  input: string;
  usd?: number;
  className?: string;
  dataTestId?: string;
}) => (
  <span className={className} data-testid={dataTestId}>
    {!stringIsInteger(input) || !usd ? (
      '...'
    ) : (
      <>
        $
        {usdValue({
          amount: denominate({
            input,
            denomination,
            decimals,
            showLastNonZeroDecimal: true,
            addCommas: false,
          }),
          usd,
        })}
      </>
    )}
  </span>
);

export default UsdValue;
