import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  IdentityBlock,
  NetworkLink,
  PulsatingLed,
  ShardLink,
  TimeAgo
} from 'components';
import { urlBuilder } from 'helpers';
import { faMapMarkerAlt } from 'icons/solid';
import { UIBlockType } from 'types';

interface GlobeProposerCardType {
  block?: UIBlockType;
  isLocationMatched?: boolean;
}

export const GlobeProposerCard = ({
  block,
  isLocationMatched
}: GlobeProposerCardType) => {
  if (!block) {
    return (
      <div className='globe-proposer-card is-empty'>
        <div className='d-flex align-items-center gap-2 text-neutral-400'>
          <PulsatingLed />
          Listening for new blocks
        </div>
      </div>
    );
  }

  const location = block.proposerIdentity?.location;

  return (
    <div className='globe-proposer-card' data-testid='globeProposerCard'>
      <div className='d-flex align-items-center justify-content-between gap-3 mb-2'>
        <div className='d-flex align-items-center gap-2'>
          <PulsatingLed />
          <span className='text-neutral-400'>Block</span>
          <NetworkLink to={urlBuilder.blockDetails(block.hash)}>
            {block.nonce}
          </NetworkLink>
        </div>
        <div className='d-flex align-items-center gap-2 text-neutral-400'>
          <ShardLink shard={block.shard} className='flex-shrink-0' />
          <span className='text-muted'>•</span>
          <TimeAgo value={block.timestamp} showAgo tooltip />
        </div>
      </div>
      <div className='d-flex align-items-center justify-content-between gap-3'>
        <div className='globe-proposer-identity text-truncate'>
          <IdentityBlock block={block} />
        </div>
        {location && isLocationMatched && (
          <div className='d-flex align-items-center text-neutral-400 text-truncate flex-shrink-0'>
            <FontAwesomeIcon icon={faMapMarkerAlt} className='me-1' />
            <span className='text-truncate'>{location}</span>
          </div>
        )}
      </div>
    </div>
  );
};
