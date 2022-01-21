import * as React from 'react';
import { urlBuilder } from 'helpers';
import { TokenType } from 'helpers/types';
import { NetworkLink, Denominate } from 'sharedComponents';
import { denomination as configDenomination } from 'appConfig';

interface TokenBlockType {
  operationToken: TokenType;
  value?: string;
}

const TokenBlock = ({ value, operationToken }: TokenBlockType) => {
  const ref = React.useRef(null);

  const denomination =
    operationToken.decimals !== undefined ? operationToken.decimals : configDenomination;

  return (
    <div ref={ref} className="token-block d-flex text-truncate">
      {value && (
        <div className="mr-1">
          <Denominate
            value={value}
            denomination={denomination}
            showLabel={false}
            showLastNonZeroDecimal={true}
          />
        </div>
      )}
      <NetworkLink
        to={urlBuilder.tokenDetails(operationToken.identifier)}
        className={`d-flex text-truncate ${operationToken?.assets?.svgUrl ? 'token-link' : ''}`}
      >
        <div className="d-flex align-items-center symbol text-truncate">
          {operationToken && (
            <>
              {operationToken.assets ? (
                <>
                  {operationToken.assets.svgUrl && (
                    <img src={operationToken.assets.svgUrl} alt=" " className="token-icon mx-1" />
                  )}
                  <div className="text-truncate">
                    {operationToken.ticker ? operationToken.ticker : operationToken.name}
                  </div>
                </>
              ) : (
                <span className="text-truncate">{operationToken.identifier}</span>
              )}
            </>
          )}
        </div>
      </NetworkLink>
    </div>
  );
};

export default TokenBlock;
