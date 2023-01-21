import { NftType, NftEnumType } from 'helpers/types';

export const nftText = (type: NftType['type']) => {
  switch (type) {
    case NftEnumType.SemiFungibleESDT:
      return 'SFT';
    case NftEnumType.NonFungibleESDT:
      return 'NFT';
    case NftEnumType.MetaESDT:
      return 'Meta-ESDT';
    default:
      return '';
  }
};
