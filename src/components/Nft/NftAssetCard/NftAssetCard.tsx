import { MouseEvent, useState } from 'react';

import classNames from 'classnames';

import { NetworkLink, NftBadge } from 'components';
import { formatBigNumber, urlBuilder } from 'helpers';
import { ZERO } from 'lib';
import { NftType, NftTypeEnum, WithClassnameType } from 'types';

import { NftCardImage } from '../NftCardImage';
import { NftWarnings } from '../NftWarnings';

interface NftAssetCardUIType extends WithClassnameType {
  nft: NftType;
}

export const NftAssetCard = ({ nft }: NftAssetCardUIType) => {
  const [isNsfwHidden, setIsNsfwHidden] = useState(Boolean(nft.isNsfw));

  const isSft = nft.type === NftTypeEnum.SemiFungibleESDT;
  const showSupply = isSft && nft.balance && nft.supply;

  const handleNsfwVisibility = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsNsfwHidden((isNsfwCurrentlyHidden) => !isNsfwCurrentlyHidden);
  };

  return (
    <NetworkLink
      to={urlBuilder.nftDetails(nft.identifier)}
      className='nft-card'
    >
      <NftCardImage nft={nft} isNsfwHidden={isNsfwHidden} />

      <div className='nft-card-top-header'>
        <NftBadge type={nft.type} />

        {showSupply && (
          <div className='badge badge-outline badge-outline-green-alt text-truncate mw-inherit. nft-card-supply'>
            <div className='nft-card-supply-wrapper gap-1'>
              <div className='nft-card-supply-balance'>
                {formatBigNumber({ value: nft.balance ?? ZERO })}
              </div>
              <div className='nft-card-supply-link'>of</div>
              <div className='nft-card-supply-total'>
                {formatBigNumber({ value: nft.supply ?? ZERO })}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className='nft-card-details'>
        <div className='nft-card-details-name text-truncate text-neutral-100'>
          {nft.name}
        </div>
        <div className='nft-card-details-collection text-neutral-400 small'>
          {nft.collection}
        </div>
      </div>

      <NftWarnings
        nft={nft}
        isNsfwHidden={isNsfwHidden}
        onNsfwVisibilityToggle={handleNsfwVisibility}
      />
    </NetworkLink>
  );
};
