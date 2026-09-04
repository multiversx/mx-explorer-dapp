import { NftAssetCard } from 'components';
import { NftType, WithClassnameType } from 'types';

export interface NftListUIType extends WithClassnameType {
  nfts: NftType[];
}

export const NftList = ({ nfts }: NftListUIType) => {
  return (
    <div className='nft-list'>
      {nfts.map((nft) => (
        <NftAssetCard nft={nft} key={`${nft.name}-${nft.identifier}`} />
      ))}
    </div>
  );
};
