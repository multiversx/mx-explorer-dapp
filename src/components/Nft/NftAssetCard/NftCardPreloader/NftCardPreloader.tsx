import { Preloader } from 'components/Preloader';

export const NftCardPreloader = () => (
  <Preloader className='nft-card-preloader'>
    <Preloader className='nft-card-preloader-badge' />
    <Preloader className='nft-card-preloader-image' />

    <Preloader className='nft-card-preloader-content'>
      <Preloader className='nft-card-preloader-name' />
      <Preloader className='nft-card-preloader-collection' />
      <Preloader className='nft-card-preloader-send' />
    </Preloader>
  </Preloader>
);
