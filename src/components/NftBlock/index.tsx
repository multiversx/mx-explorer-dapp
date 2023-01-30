import * as React from 'react';
import { NetworkLink, Denominate } from 'components';
import { urlBuilder } from 'helpers';
import { NftType, NftEnumType } from 'types';

interface NftBlockType {
  operationToken?: NftType;
  value?: string;
}

export const NftBlock = ({ value, operationToken }: NftBlockType) => {
  const ref = React.useRef(null);

  return (
    <div ref={ref} className='nft-block d-flex text-truncate'>
      {operationToken && (
        <>
          {value && operationToken.type !== NftEnumType.NonFungibleESDT && (
            <div className='me-1'>
              {operationToken.decimals !== undefined ? (
                <Denominate
                  value={value}
                  showLabel={false}
                  denomination={operationToken.decimals}
                  showLastNonZeroDecimal={true}
                />
              ) : (
                Number(value).toLocaleString('en')
              )}
            </div>
          )}
          <NetworkLink
            to={
              operationToken.type === NftEnumType.MetaESDT
                ? urlBuilder.tokenMetaEsdtDetails(operationToken.collection)
                : urlBuilder.nftDetails(operationToken.identifier)
            }
            className={`d-flex text-truncate ${
              operationToken?.assets?.svgUrl ? 'side-link' : ''
            }`}
          >
            <div className='d-flex align-items-center symbol text-truncate'>
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
                      : operationToken.name}{' '}
                    ({operationToken.identifier})
                  </div>
                </>
              ) : (
                <span className='text-truncate'>
                  {operationToken.identifier}
                </span>
              )}
            </div>
          </NetworkLink>
        </>
      )}
    </div>
  );
};
