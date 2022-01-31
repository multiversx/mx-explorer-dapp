import React from 'react';
import { NetworkLink } from 'sharedComponents';
import { urlBuilder } from 'helpers';
import { TokenArgumentType } from 'helpers/types';

const TxActionCollection = ({ token }: { token: TokenArgumentType }) => {
  const ref = React.useRef(null);

  return (
    <div ref={ref} className="collection-action-block">
      {token && token.collection && (
        <NetworkLink
          to={urlBuilder.collectionDetails(token.collection)}
          className={`d-flex ${token.svgUrl ? 'token-link' : ''}`}
        >
          <div className="d-flex align-items-center symbol">
            {token.svgUrl && <img src={token.svgUrl} alt=" " className="token-icon mr-1" />}
            <span>{token.ticker}</span>
          </div>
        </NetworkLink>
      )}
    </div>
  );
};

export default TxActionCollection;
