import * as React from 'react';
import { NetworkLink } from 'components';
import { urlBuilder } from 'helpers';
import { NftType } from 'types';

export const CollectionBlock = ({ nft }: { nft: NftType }) => {
  return (
    <div className='collection-block d-flex text-truncate'>
      <NetworkLink
        to={urlBuilder.collectionDetails(nft.collection)}
        className={`d-flex ${nft?.assets?.svgUrl ? 'side-link' : ''}`}
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
              <div className='text-truncate'>{nft.collection}</div>
            </>
          ) : (
            <span className='text-truncate'>{nft.collection}</span>
          )}
        </div>
      </NetworkLink>
    </div>
  );
};
