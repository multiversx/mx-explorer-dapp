import React from 'react';
import { NftEnumType } from 'helpers/types';
import { Denominate, NetworkLink, NftBadge } from 'sharedComponents';
import { urlBuilder } from 'helpers';

const NftValue = ({ token }: { token: any }) => {
  const ref = React.useRef(null);

  return (
    <div ref={ref} className="nft-value">
      {token && (
        <>
          {token.type !== NftEnumType.MetaESDT && (
            <NftBadge type={token.type} className="mr-1 my-auto" />
          )}
          {token.value && token.type !== NftEnumType.NonFungibleESDT && (
            <div className="mr-1 text-truncate">
              {token.decimals !== undefined ? (
                <Denominate value={token.value} showLabel={false} denomination={token.decimals} />
              ) : (
                Number(token.value).toLocaleString('en')
              )}
            </div>
          )}
          <NetworkLink
            to={urlBuilder.nftDetails(token.identifier)}
            className={`d-flex ${token.svgUrl ? 'token-link' : ''}`}
          >
            <div className="d-flex align-items-center symbol">
              {token.svgUrl && <img src={token.svgUrl} alt=" " className="token-icon mr-1" />}
              <span>{token.ticker}</span>
            </div>
          </NetworkLink>
        </>
      )}
    </div>
  );
};

export default NftValue;
