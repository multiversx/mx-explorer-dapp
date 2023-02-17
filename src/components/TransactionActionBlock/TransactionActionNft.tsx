import React from 'react';
import BigNumber from 'bignumber.js';

import { Denominate, NetworkLink, NftBadge, Overlay } from 'components';
import { urlBuilder } from 'helpers';
import { NftTypeEnum, TransactionTokenArgumentType } from 'types';

export const TransactionActionNft = ({
  token,
  showBadge,
  noValue,
  showLastNonZeroDecimal
}: {
  token: TransactionTokenArgumentType;
  showBadge?: boolean;
  noValue?: boolean;
  showLastNonZeroDecimal?: boolean;
}) => {
  const ref = React.useRef(null);

  const TokenInfo = () => (
    <div className='d-flex align-items-center symbol text-truncate'>
      {token.svgUrl && (
        <img src={token.svgUrl} alt={token.name} className='side-icon me-1' />
      )}
      <span className='text-truncate'>
        {token.ticker === token.collection ? token.identifier : token.ticker}
      </span>
    </div>
  );

  return (
    <div ref={ref} className='nft-action-block d-contents'>
      {token && token.identifier && (
        <>
          {showBadge && token.type !== NftTypeEnum.MetaESDT && (
            <NftBadge type={token.type} className='me-1 my-auto' />
          )}
          {!noValue &&
            token.value &&
            token.type !== NftTypeEnum.NonFungibleESDT && (
              <div className={`me-1  ${token.svgUrl ? 'text-truncate' : ''}`}>
                {token.decimals !== undefined ? (
                  <Denominate
                    value={token.value}
                    showLabel={false}
                    denomination={token.decimals}
                    showLastNonZeroDecimal={showLastNonZeroDecimal}
                  />
                ) : Number(token.value).toLocaleString('en') !== '∞' ? (
                  <span className='badge badge-orange'>
                    {new BigNumber(token.value).toFormat()}
                  </span>
                ) : (
                  ''
                )}
              </div>
            )}
          <NetworkLink
            to={
              token.type === NftTypeEnum.MetaESDT && token?.collection
                ? urlBuilder.tokenMetaEsdtDetails(token.collection)
                : urlBuilder.nftDetails(token.identifier)
            }
            className={`d-flex text-truncate ${
              token.svgUrl ? 'side-link' : ''
            }`}
            {...(token.type === NftTypeEnum.MetaESDT
              ? { 'aria-label': token.identifier }
              : {})}
          >
            {token.type === NftTypeEnum.MetaESDT && token?.svgUrl ? (
              <Overlay title={token.identifier}>
                <TokenInfo />
              </Overlay>
            ) : (
              <TokenInfo />
            )}
          </NetworkLink>
        </>
      )}
    </div>
  );
};
