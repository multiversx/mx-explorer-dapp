export const getCustomPageName = ({
  pathname,
  basePage
}: {
  pathname: string;
  basePage: string;
}) => {
  const fullPageName = pathname.substring(1).replaceAll('/', '-');
  if (fullPageName === 'collections-sft') {
    return 'SFT Collections';
  }
  if (fullPageName === 'collections-nft') {
    return 'NFT Collections';
  }

  switch (basePage) {
    case 'nft-collections':
    case 'collections-nft':
      return 'NFT Collections';
    case 'sft-collections':
    case 'collections-sft':
      return 'SFT Collections';
    case 'meta-tokens':
    case 'meta-esdt':
      return 'Meta-ESDT';
    case 'nfts':
      return 'NFTs';
    case 'sfts':
      return 'SFTs';
    case 'providers':
      return 'Staking Providers';
    default:
      return basePage.replaceAll('-', ' ').toLowerCase();
  }
};

export const formatClassName = (className: string) => {
  return className.replaceAll(' ', '-').toLowerCase();
};
