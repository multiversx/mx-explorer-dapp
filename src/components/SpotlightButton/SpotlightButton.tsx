import React from 'react';
import { faExternalLink } from 'icons/regular';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector } from 'react-redux';

import { ReactComponent as SpotlightLogo } from 'assets/img/logos/xspotlight.svg';
import { activeNetworkSelector } from 'redux/selectors';

export const SpotlightButton = ({ path }: { path: string }) => {
  const { nftExplorerAddress } = useSelector(activeNetworkSelector);

  if (!nftExplorerAddress || !path) {
    return null;
  }

  return (
    <a
      href={`${nftExplorerAddress}${path}`}
      target='_blank'
      rel='noreferrer nofollow noopener'
      className='btn btn-dark d-flex align-items-center gap-2'
    >
      View on <SpotlightLogo className='spotlight-btn-logo' />
      <FontAwesomeIcon
        size='xs'
        icon={faExternalLink}
        style={{ pointerEvents: 'none' }}
        className='text-neutral-400'
      />
    </a>
  );
};
