import * as React from 'react';

import { NetworkLink } from 'components';
import { urlBuilder } from 'helpers';
import { NftType, NftTypeEnum } from 'types';

export const CollectionBlock = ({ nft }: { nft: NftType }) => {
  return (
    <div className='collection-block d-flex text-truncate'>
      <NetworkLink
        to={
          nft?.type === NftTypeEnum.MetaESDT
            ? urlBuilder.tokenMetaEsdtDetails(nft.collection)
            : urlBuilder.collectionDetails(nft.collection)
        }
        className={`d-flex text-truncate ${
          nft?.assets?.svgUrl ? 'side-link' : ''
        }`}
      >
        <div className='d-flex align-items-center symbol text-truncate'>
          {nft.assets ? (
            <>
              {nft.assets.svgUrl && (
                <img
                  src={nft.assets.svgUrl}
                  className='side-icon me-1'
                  alt={nft.collection}
                />
              )}
              <div className='text-truncate'>
                {nft.ticker ?? nft.collection}
              </div>
            </>
          ) : (
            <span className='text-truncate'>
              {nft.ticker ?? nft.collection}
            </span>
          )}
        </div>
      </NetworkLink>
    </div>
  );
};
