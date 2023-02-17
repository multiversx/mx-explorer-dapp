import { NftTypeEnum } from 'types';

export const nftText = (type: NftTypeEnum) => {
  switch (type) {
    case NftTypeEnum.SemiFungibleESDT:
      return 'SFT';
    case NftTypeEnum.NonFungibleESDT:
      return 'NFT';
    case NftTypeEnum.MetaESDT:
      return 'Meta-ESDT';
    default:
      return '';
  }
};
