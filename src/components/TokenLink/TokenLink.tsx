import React from 'react';
import { NetworkLink } from 'components';
import { urlBuilder } from 'helpers';
import { TokenType } from 'types';

export const TokenLink = ({ token }: { token: TokenType }) => {
  return (
    <NetworkLink
      to={urlBuilder.tokenDetails(token.identifier)}
      className={`d-flex text-truncate ${
        token?.assets?.svgUrl ? 'side-link' : ''
      }`}
    >
      <div className='d-flex align-items-center symbol text-truncate'>
        {token?.assets ? (
          <>
            {token?.assets?.svgUrl && (
              <img
                src={token.assets.svgUrl}
                alt={token.name}
                className='side-icon me-1'
              />
            )}
            <div className='text-truncate'>
              {token?.ticker ? token.ticker : token.name}
            </div>
          </>
        ) : (
          <span className='text-truncate'>{token.identifier}</span>
        )}
      </div>
    </NetworkLink>
  );
};
