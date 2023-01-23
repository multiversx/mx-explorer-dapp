import React from 'react';
import { NetworkLink } from 'components';
import { urlBuilder } from 'helpers';
import { TokenArgumentType } from 'types';

export const TxActionCollection = ({ token }: { token: TokenArgumentType }) => {
  const ref = React.useRef(null);

  return (
    <div ref={ref} className="collection-action-block">
      {token && token.collection && (
        <NetworkLink
          to={urlBuilder.collectionDetails(token.collection)}
          className={`d-flex ${token.svgUrl ? 'side-link' : 'text-truncate'}`}
        >
          <div className="d-flex align-items-center symbol text-truncate">
            {token.svgUrl && <img src={token.svgUrl} alt={token.name} className="side-icon me-1" />}
            <span className="text-truncate">{token.ticker}</span>
          </div>
        </NetworkLink>
      )}
    </div>
  );
};
