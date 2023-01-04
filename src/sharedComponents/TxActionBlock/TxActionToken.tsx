import React from 'react';
import { Denominate, NetworkLink } from 'sharedComponents';
import { urlBuilder } from 'helpers';
import { TokenArgumentType } from 'helpers/types';
import { denomination as configDenomination } from 'appConfig';

const TxActionToken = ({
  token,
  noValue,
  showLastNonZeroDecimal,
}: {
  token: TokenArgumentType;
  noValue?: boolean;
  showLastNonZeroDecimal?: boolean;
}) => {
  const ref = React.useRef(null);
  const denomination = token.decimals !== undefined ? token.decimals : configDenomination;

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
        </>
      )}
    </div>
  );
};

export default TxActionToken;
