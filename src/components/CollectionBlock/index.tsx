import * as React from 'react';
import { types, urlBuilder } from 'helpers';
import { NetworkLink } from 'components';

const CollectionBlock = ({ nft }: { nft: types.NftType }) => {
  return (
    <div className="collection-block d-flex text-truncate">
      <NetworkLink
        to={urlBuilder.collectionDetails(nft.collection)}
        className={`d-flex ${nft?.assets?.svgUrl ? 'side-link' : ''}`}
      >
        <div className="d-flex align-items-center symbol text-truncate">
          {nft.assets ? (
            <>
              {nft.assets.svgUrl && (
                <img src={nft.assets.svgUrl} className="side-icon mr-1" alt={nft.collection} />
              )}
              <div className="text-truncate">{nft.collection}</div>
            </>
          ) : (
            <span className="text-truncate">{nft.collection}</span>
          )}
        </div>
      </NetworkLink>
    </div>
  );
};

export default CollectionBlock;
