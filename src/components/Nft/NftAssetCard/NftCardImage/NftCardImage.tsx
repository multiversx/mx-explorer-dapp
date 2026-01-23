import { faHexagonVerticalNft } from '@fortawesome/pro-regular-svg-icons';
import { faEyeSlash } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { DataTestIdsEnum } from 'localConstants/dataTestIds.enum';
import { NftType } from 'types/nfts';
import { NftTypeEnum } from 'types/sdkDapp/sdkDappNft.types';

interface NftCardImagePropsType {
  isNsfwHidden: boolean;
  nftItem: NftType;
}

export const NftCardImage = ({
  nftItem,
  isNsfwHidden
}: NftCardImagePropsType) => {
  const nftMedia = nftItem.media && nftItem.media.at(0);
  const nftThumbnail = nftMedia && nftMedia.thumbnailUrl;
  const isSft = nftItem.type === NftTypeEnum.SemiFungibleESDT;
  const badgeLabel = isSft ? 'SFT' : 'NFT';

  if (nftItem.scamInfo) {
    return (
      <div
        className='nft-card-image'
        data-testid={DataTestIdsEnum.scamPlaceholder}
      >
        <div className='nft-card-image-text'>SCAM</div>
      </div>
    );
  }

  if (nftItem.isNsfw && isNsfwHidden) {
    return (
      <div className='nft-card-image'>
        <FontAwesomeIcon icon={faEyeSlash} className='nft-card-image-icon' />
      </div>
    );
  }

  if (nftThumbnail) {
    return (
      <div className='nft-card-image'>
        <img
          src={nftThumbnail}
          className='nft-card-image-source'
          alt={`${nftItem.name} ${badgeLabel} Image`}
        />
      </div>
    );
  }

  return (
    <div className='nft-card-image'>
      <FontAwesomeIcon
        icon={faHexagonVerticalNft}
        className='nft-card-image-icon'
      />
    </div>
  );
};
