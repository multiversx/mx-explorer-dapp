import React from 'react';
import { Denominate, NetworkLink } from 'components';
import { urlBuilder, formatUSD } from 'helpers';
import { TokenArgumentType } from 'types';
import { DECIMALS } from 'config';

export const TxActionToken = ({
  token,
  noValue,
  showLastNonZeroDecimal,
}: {
  token: TokenArgumentType;
  noValue?: boolean;
  showLastNonZeroDecimal?: boolean;
}) => {
  const ref = React.useRef(null);
  const denomination = token.decimals !== undefined ? token.decimals : DECIMALS;

  return (
    <div ref={ref} className="token-action-block">
      {token && token.token && (
        <>
          {!noValue && token.value && (
            <div className="mr-1 text-truncate">
              <Denominate
                value={token.value}
                showLabel={false}
                denomination={denomination}
                showLastNonZeroDecimal={showLastNonZeroDecimal}
              />
            </div>
          )}
          <NetworkLink
            to={urlBuilder.tokenDetails(token.token)}
            className={`d-flex ${token.svgUrl ? 'side-link' : 'text-truncate'}`}
          >
            <div className="d-flex align-items-center symbol text-truncate">
              {token.svgUrl && (
                <img src={token.svgUrl} alt={token.name} className="side-icon mr-1" />
              )}
              <span className="text-truncate">{token.ticker}</span>
            </div>
          </NetworkLink>
          {token?.valueUSD && (
            <div className="mr-1 text-truncate text-secondary ml-1">
              ({formatUSD({ amount: token.valueUSD, digits: 2 })})
            </div>
          )}
        </>
      )}
    </div>
  );
};
