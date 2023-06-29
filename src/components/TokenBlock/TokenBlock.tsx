import React from 'react';
import { NetworkLink, Denominate } from 'components';
import { DECIMALS } from 'config';
import { urlBuilder } from 'helpers';
import { TokenType } from 'types';

interface TokenBlockType {
  operationToken: TokenType;
  value?: string;
}

export const TokenBlock = ({ value, operationToken }: TokenBlockType) => {
  const denomination =
    operationToken.decimals !== undefined ? operationToken.decimals : DECIMALS;

  return (
    <div className='token-block d-flex text-truncate'>
      {value && (
        <div className='me-1'>
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
        className={`d-flex text-truncate ${
          operationToken?.assets?.svgUrl ? 'side-link' : ''
        }`}
      >
        <div className='d-flex align-items-center symbol text-truncate'>
          {operationToken && (
            <>
              {operationToken.assets ? (
                <>
                  {operationToken.assets.svgUrl && (
                    <img
                      src={operationToken.assets.svgUrl}
                      alt={operationToken.name}
                      className='side-icon me-1'
                    />
                  )}
                  <div className='text-truncate'>
                    {operationToken.ticker
                      ? operationToken.ticker
                      : operationToken.name}
                  </div>
                </>
              ) : (
                <span className='text-truncate'>
                  {operationToken.identifier}
                </span>
              )}
            </>
          )}
        </div>
      </NetworkLink>
    </div>
  );
};
