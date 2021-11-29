import * as React from 'react';
import { urlBuilder } from 'helpers';
import { NftType } from 'helpers/types';
import { NetworkLink, Denominate } from 'sharedComponents';

interface NftBlockType {
  operationToken?: NftType;
  value?: string;
}

const NftBlock = ({ value, operationToken }: NftBlockType) => {
  const ref = React.useRef(null);

  return (
    <div ref={ref} className="d-flex text-truncate">
      {operationToken && (
        <>
          {value && operationToken.type !== 'NonFungibleESDT' && (
            <>
              <div className="mr-2">Value</div>
              <div className="mr-1">
                {operationToken.decimals ? (
                  <Denominate
                    value={value}
                    showLabel={false}
                    denomination={operationToken.decimals}
                  />
                ) : (
                  Number(value).toLocaleString('en')
                )}
              </div>
            </>
          )}
          <NetworkLink
            to={urlBuilder.nftDetails(operationToken.identifier)}
            className={`d-flex text-truncate ${operationToken?.assets?.svgUrl ? 'token-link' : ''}`}
          >
            <div className="d-flex align-items-center symbol text-truncate">
              {operationToken.assets ? (
                <>
                  {operationToken.assets.svgUrl && (
                    <img src={operationToken.assets.svgUrl} alt=" " className="token-icon mr-1" />
                  )}
                  <div className="text-truncate">
                    {operationToken.name} ({operationToken.identifier})
                  </div>
                </>
              ) : (
                <span className="text-truncate">{operationToken.identifier}</span>
              )}
            </div>
          </NetworkLink>
        </>
      )}
    </div>
  );
};

export default NftBlock;
