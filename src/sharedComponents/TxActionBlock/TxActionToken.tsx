import React from 'react';
import { Denominate, NetworkLink } from 'sharedComponents';
import { urlBuilder } from 'helpers';
import { TokenArgumentType } from 'helpers/types';
import { denomination as configDenomination } from 'appConfig';

const TxActionToken = ({ token, noValue }: { token: TokenArgumentType; noValue?: boolean }) => {
  const ref = React.useRef(null);
  const denomination = token.decimals !== undefined ? token.decimals : configDenomination;

  return (
    <div ref={ref} className="token-action-block">
      {token && token.token && (
        <>
          {!noValue && token.value && (
            <div className="mr-1 text-truncate">
              <Denominate value={token.value} showLabel={false} denomination={denomination} />
            </div>
          )}
          <NetworkLink
            to={urlBuilder.tokenDetails(token.token)}
            className={`d-flex ${token.svgUrl ? 'token-link' : ''}`}
          >
            <div className="d-flex align-items-center symbol">
              {token.svgUrl && <img src={token.svgUrl} alt=" " className="token-icon mr-1" />}
              <span>{token.ticker}</span>
            </div>
          </NetworkLink>
        </>
      )}
    </div>
  );
};

export default TxActionToken;
