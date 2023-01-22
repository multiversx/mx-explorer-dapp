import * as React from 'react';
import { urlBuilder } from 'helpers';
import { BlockType } from 'types';
import { NetworkLink, Trim } from 'components';

export const IdentityBlock = ({ block }: { block: BlockType }) => {
  if (!block.proposer) {
    return <span className="text-secondary">N/A</span>;
  }

  return (
    <div className="d-flex text-truncate">
      <NetworkLink
        to={urlBuilder.nodeDetails(block.proposer)}
        className={`d-flex text-truncate ${block.proposerIdentity ? 'side-link' : ''}`}
      >
        {block.proposerIdentity ? (
          <div className="d-flex align-items-center symbol text-truncate">
            {block?.proposerIdentity?.avatar && (
              <img src={block?.proposerIdentity?.avatar} className="side-icon mr-1" alt=" " />
            )}
            <div className="text-truncate">{block?.proposerIdentity?.name}</div>
          </div>
        ) : (
          <Trim text={block.proposer} />
        )}
      </NetworkLink>
    </div>
  );
};
