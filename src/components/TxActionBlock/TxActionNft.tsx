import React from 'react';
import BigNumber from 'bignumber.js';
import { Denominate, NetworkLink, NftBadge } from 'components';
import { urlBuilder } from 'helpers';
import { NftEnumType, TokenArgumentType } from 'types';

export const TxActionNft = ({
  token,
  showBadge,
  noValue,
  showLastNonZeroDecimal
}: {
  token: TokenArgumentType;
  showBadge?: boolean;
  noValue?: boolean;
  showLastNonZeroDecimal?: boolean;
}) => {
  const ref = React.useRef(null);

  return (
    <div ref={ref} className='nft-action-block'>
      {token && token.identifier && (
        <>
          {showBadge && token.type !== NftEnumType.MetaESDT && (
            <NftBadge type={token.type} className='me-1 my-auto' />
          )}
          {!noValue &&
            token.value &&
            token.type !== NftEnumType.NonFungibleESDT && (
              <div
                className={`me-1 badge badge-orange ${
                  token.svgUrl ? 'text-truncate' : ''
                }`}
              >
                {token.decimals !== undefined ? (
                  <Denominate
                    value={token.value}
                    showLabel={false}
                    denomination={token.decimals}
                    showLastNonZeroDecimal={showLastNonZeroDecimal}
                  />
                ) : Number(token.value).toLocaleString('en') !== '∞' ? (
                  new BigNumber(token.value).toFormat()
                ) : (
                  ''
                )}
              </div>
            )}
          <NetworkLink
            to={urlBuilder.nftDetails(token.identifier)}
            className={`d-flex text-truncate ${
              token.svgUrl ? 'side-link' : ''
            }`}
          >
            <div className='d-flex align-items-center symbol text-truncate'>
              {token.svgUrl && (
                <img
                  src={token.svgUrl}
                  alt={token.name}
                  className='side-icon me-1'
                />
              )}
              <span className='text-truncate'>
                {token.ticker === token.collection
                  ? token.identifier
                  : token.ticker}
              </span>
            </div>
          </NetworkLink>
        </>
      )}
    </div>
  );
};
