import { faHexagonVerticalNft } from '@fortawesome/pro-regular-svg-icons';
import { faEyeSlash } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { ImageWithFallback } from 'components';
import { NftType, NftTypeEnum } from 'types';

interface NftCardImagePropsType {
  isNsfwHidden: boolean;
  nft: NftType;
}

export const NftCardImage = ({ nft, isNsfwHidden }: NftCardImagePropsType) => {
  const nftMedia = nft.media?.[0]?.thumbnailUrl ?? nft.media?.[0]?.url;
  const isSft = nft.type === NftTypeEnum.SemiFungibleESDT;
  const badgeLabel = isSft ? 'SFT' : 'NFT';

  if (nft.scamInfo) {
    return (
      <div className='nft-card-image'>
        <div className='nft-card-image-text'>SCAM</div>
      </div>
    );
  }

  if (nft.isNsfw && isNsfwHidden) {
    return (
      <div className='nft-card-image'>
        <FontAwesomeIcon icon={faEyeSlash} className='nft-card-image-icon' />
      </div>
    );
  }

  if (nftMedia) {
    return (
      <div className='nft-card-image'>
        <ImageWithFallback
          src={nftMedia}
          className='logo-img'
          alt={`${nft.name} ${badgeLabel} Image`}
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
