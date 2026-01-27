import { NftAssetCard } from 'components';
import { NftType, NftTypeEnum, WithClassnameType } from 'types';

export interface NftListUIType extends WithClassnameType {
  nfts: NftType[];
  type: NftTypeEnum;
}

export const NftList = ({ nfts, type }: NftListUIType) => {
  return (
    <div className='nft-list'>
      {nfts.map((nft) => (
        <NftAssetCard nft={nft} key={`${nft.name}-${nft.identifier}`} />
      ))}
    </div>
  );
};
